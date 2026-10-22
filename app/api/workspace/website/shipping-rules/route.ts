
import { NextRequest } from "next/server";
import { StoreShippingPricingType } from "@/lib/generated/prisma";

import prisma from "@/lib/prisma";
import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

async function getWebsiteContext() {
  const { tenant, membership } = await requireWorkspaceAccess();

  const website = await prisma.website.findUnique({
    where: { tenantId: tenant.id },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
    },
  });

  if (!website || !website.isActive) {
    return {
      website: null,
      membership,
      error: ApiResponse.error({
        message: "Customer website is not available.",
        code: "WEBSITE_NOT_AVAILABLE",
        status: 404,
      }),
    };
  }

  return { website, membership, error: null };
}

function canEdit(role: string) {
  return role === "OWNER" || role === "ADMIN";
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || value === null || typeof value === "string";
}

function optionalText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function isValidNonNegativeNumber(value: unknown): boolean {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
}

export async function GET() {
  try {
    const { website, error } = await getWebsiteContext();

    if (error) return error;

    const [settings, rules] = await Promise.all([
      prisma.storeSettings.findUnique({
        where: { websiteId: website.id },
        select: {
          shippingEnabled: true,
          shippingMode: true,
          defaultCurrency: true,
        },
      }),
      prisma.storeShippingRule.findMany({
        where: { websiteId: website.id },
        orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
      }),
    ]);

    return ApiResponse.success({
      message: "Shipping rules loaded.",
      data: {
        website: {
          name: website.name,
          slug: website.slug,
        },
        settings: settings ?? {
          shippingEnabled: false,
          shippingMode: "MANUAL",
          defaultCurrency: "INR",
        },
        rules,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { website, membership, error } = await getWebsiteContext();

    if (error) return error;

    if (!canEdit(membership.role)) {
      return ApiResponse.error({
        message: "Only workspace owners and admins can manage shipping rules.",
        code: "SHIPPING_RULE_FORBIDDEN",
        status: 403,
      });
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return ApiResponse.error({
        message: "Request body must contain valid JSON.",
        code: "INVALID_JSON",
        status: 400,
      });
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return ApiResponse.error({
        message: "A valid shipping rule is required.",
        code: "INVALID_SHIPPING_RULE",
        status: 400,
      });
    }

    const input = body as Record<string, unknown>;

    const name = typeof input.name === "string" ? input.name.trim() : "";
    const countryCode =
      typeof input.countryCode === "string"
        ? input.countryCode.trim().toUpperCase()
        : "IN";
    const currency =
      typeof input.currency === "string"
        ? input.currency.trim().toUpperCase()
        : "INR";
        const pricingType: StoreShippingPricingType =
        input.pricingType === "WEIGHT_BASED"
          ? StoreShippingPricingType.WEIGHT_BASED
          : StoreShippingPricingType.FLAT_RATE;

    if (!name || name.length > 120) {
      return ApiResponse.error({
        message: "Rule name is required and must not exceed 120 characters.",
        code: "INVALID_SHIPPING_RULE_NAME",
        status: 400,
      });
    }

    if (!/^[A-Z]{2}$/.test(countryCode)) {
      return ApiResponse.error({
        message: "Country code must contain two letters, such as IN.",
        code: "INVALID_SHIPPING_COUNTRY",
        status: 400,
      });
    }

    if (!/^[A-Z]{3}$/.test(currency)) {
      return ApiResponse.error({
        message: "Currency must be a three-letter code, such as INR.",
        code: "INVALID_SHIPPING_CURRENCY",
        status: 400,
      });
    }

    if (
        input.pricingType !== undefined &&
        input.pricingType !== "FLAT_RATE" &&
        input.pricingType !== "WEIGHT_BASED"
      ) {
        return ApiResponse.error({
          message: "Pricing type must be FLAT_RATE or WEIGHT_BASED.",
          code: "INVALID_SHIPPING_PRICING_TYPE",
          status: 400,
        });
      }

    const optionalStringFields = [
      "zoneName",
      "stateCode",
      "postalCode",
      "postalCodePrefix",
    ] as const;

    for (const field of optionalStringFields) {
      if (!isOptionalString(input[field])) {
        return ApiResponse.error({
          message: `${field} must be a string or null.`,
          code: "INVALID_SHIPPING_RULE",
          status: 400,
        });
      }
    }

    const flatRate: number =
    input.flatRate === undefined ? 0 : Number(input.flatRate);
  
  const baseCharge: number =
    input.baseCharge === undefined ? 0 : Number(input.baseCharge);
  
  const includedWeightKg: number | null =
    input.includedWeightKg === undefined ||
    input.includedWeightKg === null
      ? null
      : Number(input.includedWeightKg);
  
  const additionalPerKg: number | null =
    input.additionalPerKg === undefined ||
    input.additionalPerKg === null
      ? null
      : Number(input.additionalPerKg);

    if (
      !isValidNonNegativeNumber(flatRate) ||
      !isValidNonNegativeNumber(baseCharge) ||
      (includedWeightKg !== null &&
        !isValidNonNegativeNumber(includedWeightKg)) ||
      (additionalPerKg !== null &&
        !isValidNonNegativeNumber(additionalPerKg))
    ) {
      return ApiResponse.error({
        message: "Shipping charges and weight values must be non-negative numbers.",
        code: "INVALID_SHIPPING_AMOUNT",
        status: 400,
      });
    }

    if (
      pricingType === StoreShippingPricingType.WEIGHT_BASED &&
      (includedWeightKg === null || additionalPerKg === null)
    ) {
      return ApiResponse.error({
        message:
          "Weight-based rules require both included weight and additional charge per kg.",
        code: "INVALID_WEIGHT_PRICING",
        status: 400,
      });
    }

    if (
      input.isActive !== undefined &&
      typeof input.isActive !== "boolean"
    ) {
      return ApiResponse.error({
        message: "isActive must be a boolean.",
        code: "INVALID_SHIPPING_RULE",
        status: 400,
      });
    }

    const effectiveFrom =
      input.effectiveFrom === undefined || input.effectiveFrom === null || input.effectiveFrom === ""
        ? null
        : new Date(String(input.effectiveFrom));

    const effectiveTo =
      input.effectiveTo === undefined || input.effectiveTo === null || input.effectiveTo === ""
        ? null
        : new Date(String(input.effectiveTo));

    if (
      (effectiveFrom && Number.isNaN(effectiveFrom.getTime())) ||
      (effectiveTo && Number.isNaN(effectiveTo.getTime()))
    ) {
      return ApiResponse.error({
        message: "Effective dates must be valid dates.",
        code: "INVALID_SHIPPING_DATES",
        status: 400,
      });
    }

    if (effectiveFrom && effectiveTo && effectiveTo < effectiveFrom) {
      return ApiResponse.error({
        message: "Effective To cannot be earlier than Effective From.",
        code: "INVALID_SHIPPING_DATES",
        status: 400,
      });
    }

    const rule = await prisma.storeShippingRule.create({
      data: {
        websiteId: website.id,
        name,
        zoneName: optionalText(input.zoneName),
        countryCode,
        stateCode: optionalText(input.stateCode)?.toUpperCase() ?? null,
        postalCode: optionalText(input.postalCode),
        postalCodePrefix: optionalText(input.postalCodePrefix),
        pricingType,
        currency,
        flatRate,
        baseCharge,
        includedWeightKg,
        additionalPerKg,
        isActive: input.isActive === true,
        effectiveFrom,
        effectiveTo,
      },
    });

    return ApiResponse.created({
      message: "Shipping rule created successfully.",
      data: { rule },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
