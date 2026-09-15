/**
 * Author: Prem Singh
 * Purpose: Provides authenticated Admin API access for ROOTYM GST and invoice tax configuration.
 */

import { NextRequest, NextResponse } from "next/server";

import {
  authenticateAdmin,
} from "@/lib/auth";

import {
  createBillingTaxConfiguration,
  getActiveBillingTaxConfiguration,
  listBillingTaxConfigurations,
} from "@/lib/services/billing/billing-tax-configuration.service";

function unauthorizedResponse(error: string, status = 401) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    {
      status,
    }
  );
}

function parseDate(
  value: unknown,
  fieldName: string
): Date {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} is required.`);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`${fieldName} is invalid.`);
  }

  return date;
}

function parseOptionalDate(
  value: unknown,
  fieldName: string
): Date | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return parseDate(value, fieldName);
}

function parseNumber(
  value: unknown,
  fieldName: string
): number {
  if (
    typeof value !== "number" &&
    typeof value !== "string"
  ) {
    throw new Error(`${fieldName} is required.`);
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${fieldName} must be a valid number.`);
  }

  return parsed;
}

function parseBoolean(
  value: unknown,
  fieldName: string
): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`${fieldName} must be true or false.`);
  }

  return value;
}

function parseString(
  value: unknown,
  fieldName: string,
  required = true
): string | null {
  if (typeof value !== "string") {
    if (!required && (value === undefined || value === null)) {
      return null;
    }

    throw new Error(`${fieldName} is required.`);
  }

  const normalized = value.trim();

  if (!normalized && required) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalized || null;
}

export async function GET(request: NextRequest) {
  const auth = await authenticateAdmin(request);

  if (!auth.authenticated) {
    return unauthorizedResponse(
      auth.error ?? "Authentication required.",
      auth.status ?? 401
    );
  }

  try {
    const includeHistory =
      request.nextUrl.searchParams.get("history") === "true";

    const configuration = await getActiveBillingTaxConfiguration();

    const history = includeHistory
      ? await listBillingTaxConfigurations()
      : undefined;

    return NextResponse.json({
      success: true,
      configuration,
      ...(includeHistory ? { history } : {}),
    });
  } catch (error) {
    console.error(
      "Failed to load Admin billing tax configuration:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load tax configuration.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticateAdmin(request);

  if (!auth.authenticated) {
    return unauthorizedResponse(
      auth.error ?? "Authentication required.",
      auth.status ?? 401
    );
  }

  try {
    const body = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "A valid configuration object is required.",
        },
        {
          status: 400,
        }
      );
    }

    const configuration =
      await createBillingTaxConfiguration({
        name: parseString(
          body.name,
          "Configuration name"
        )!,
        effectiveFrom: parseDate(
          body.effectiveFrom,
          "Effective from"
        ),
        effectiveTo: parseOptionalDate(
          body.effectiveTo,
          "Effective to"
        ),
        gstEnabled: parseBoolean(
          body.gstEnabled,
          "GST enabled"
        ),
        cgstRate: parseNumber(
          body.cgstRate,
          "CGST rate"
        ),
        sgstRate: parseNumber(
          body.sgstRate,
          "SGST rate"
        ),
        igstRate: parseNumber(
          body.igstRate,
          "IGST rate"
        ),
        legalName: parseString(
          body.legalName,
          "Legal business name",
          false
        ),
        gstin: parseString(
          body.gstin,
          "GSTIN",
          false
        ),
        registeredAddressLine1: parseString(
          body.registeredAddressLine1,
          "Registered address line 1",
          false
        ),
        registeredAddressLine2: parseString(
          body.registeredAddressLine2,
          "Registered address line 2",
          false
        ),
        registeredCity: parseString(
          body.registeredCity,
          "Registered city",
          false
        ),
        registeredState: parseString(
          body.registeredState,
          "Registered state"
        )!,
        registeredPostalCode: parseString(
          body.registeredPostalCode,
          "Registered postal code",
          false
        ),
        registeredCountry: parseString(
          body.registeredCountry,
          "Registered country"
        )!,
        invoicePrefix: parseString(
          body.invoicePrefix,
          "Invoice prefix"
        )!,
        isActive: parseBoolean(
          body.isActive,
          "Active"
        ),
      });

    return NextResponse.json(
      {
        success: true,
        configuration,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to save tax configuration.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 400,
      }
    );
  }
}
