
import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import { encryptSecret } from "@/lib/utils/secret-encryption";

const SETTINGS_SELECT = {
  id: true,
  websiteId: true,
  storeEnabled: true,
  cartEnabled: true,
  guestCheckoutEnabled: true,
  defaultCurrency: true,
  shippingMode: true,
  createdAt: true,
  updatedAt: true,
} as const;


const PAYMENT_SELECT = {
    id: true,
    websiteId: true,
    provider: true,
    environment: true,
    publicKeyId: true,
    encryptedKeySecret: true,
    encryptedWebhookSecret: true,
    paymentsEnabled: true,
    verifiedAt: true,
    createdAt: true,
    updatedAt: true,
  } as const;
  

async function getContext() {
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

export async function GET() {
  try {
    const { website, error } = await getContext();

    if (error) return error;

    const [settings, payment] = await Promise.all([
      prisma.storeSettings.findUnique({
        where: { websiteId: website.id },
        select: SETTINGS_SELECT,
      }),
      prisma.storePaymentConfiguration.findUnique({
        where: { websiteId: website.id },
        select: PAYMENT_SELECT,
      }),
    ]);

    return ApiResponse.success({
        message: "Online store settings loaded.",
        data: {
          website: {
            name: website.name,
            slug: website.slug,
          },
          settings,
          payment: payment
            ? {
                id: payment.id,
                websiteId: payment.websiteId,
                provider: payment.provider,
                environment: payment.environment,
                publicKeyId: payment.publicKeyId,
                paymentsEnabled: payment.paymentsEnabled,
                verifiedAt: payment.verifiedAt,
                createdAt: payment.createdAt,
                updatedAt: payment.updatedAt,
              }
            : null,
          secretsConfigured: {
            keySecret: Boolean(payment?.encryptedKeySecret),
            webhookSecret: Boolean(payment?.encryptedWebhookSecret),
          },
        },
      });
  } catch (error) {
    return handleApiError(error);
  }
}

interface SettingsPayload {
  storeEnabled?: boolean;
  cartEnabled?: boolean;
  guestCheckoutEnabled?: boolean;
  defaultCurrency?: string;
  shippingMode?: string;
  provider?: string;
  environment?: string;
  publicKeyId?: string | null;
  keySecret?: string;
  webhookSecret?: string;
  paymentsEnabled?: boolean;
}

export async function PATCH(request: NextRequest) {
  try {
    const { website, membership, error } = await getContext();

    if (error) return error;

    if (!canEdit(membership.role)) {
      return ApiResponse.error({
        message: "Only workspace owners and admins can update store settings.",
        code: "STORE_SETTINGS_FORBIDDEN",
        status: 403,
      });
    }

    const body = (await request.json()) as SettingsPayload;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return ApiResponse.error({
        message: "A valid settings object is required.",
        code: "INVALID_STORE_SETTINGS",
        status: 400,
      });
    }

    const booleanFields = [
      "storeEnabled",
      "cartEnabled",
      "guestCheckoutEnabled",
      "paymentsEnabled",
    ] as const;

    for (const field of booleanFields) {
      if (
        Object.prototype.hasOwnProperty.call(body, field) &&
        typeof body[field] !== "boolean"
      ) {
        return ApiResponse.error({
          message: `${field} must be a boolean.`,
          code: "INVALID_STORE_SETTINGS",
          status: 400,
        });
      }
    }

    const defaultCurrency =
      body.defaultCurrency === undefined
        ? undefined
        : body.defaultCurrency.trim().toUpperCase();

    if (
      defaultCurrency !== undefined &&
      !/^[A-Z]{3}$/.test(defaultCurrency)
    ) {
      return ApiResponse.error({
        message: "Currency must be a three-letter currency code.",
        code: "INVALID_STORE_CURRENCY",
        status: 400,
      });
    }

    if (
      body.shippingMode !== undefined &&
      body.shippingMode !== "MANUAL"
    ) {
      return ApiResponse.error({
        message: "Only manual shipping is supported currently.",
        code: "INVALID_SHIPPING_MODE",
        status: 400,
      });
    }

    if (
      body.provider !== undefined &&
      body.provider !== "RAZORPAY"
    ) {
      return ApiResponse.error({
        message: "Only Razorpay is supported currently.",
        code: "INVALID_PAYMENT_PROVIDER",
        status: 400,
      });
    }

    if (
      body.environment !== undefined &&
      body.environment !== "TEST" &&
      body.environment !== "LIVE"
    ) {
      return ApiResponse.error({
        message: "Environment must be TEST or LIVE.",
        code: "INVALID_PAYMENT_ENVIRONMENT",
        status: 400,
      });
    }

    for (const field of ["keySecret", "webhookSecret"] as const) {
      if (
        body[field] !== undefined &&
        (typeof body[field] !== "string" ||
          body[field].trim().length === 0 ||
          body[field].length > 2000)
      ) {
        return ApiResponse.error({
          message: `${field} must be a non-empty string of at most 2000 characters.`,
          code: "INVALID_PAYMENT_SECRET",
          status: 400,
        });
      }
    }

    if (
      body.publicKeyId !== undefined &&
      body.publicKeyId !== null &&
      (typeof body.publicKeyId !== "string" ||
        body.publicKeyId.trim().length > 200)
    ) {
      return ApiResponse.error({
        message: "Invalid Razorpay public key identifier.",
        code: "INVALID_PUBLIC_KEY",
        status: 400,
      });
    }

    const existingPayment =
      await prisma.storePaymentConfiguration.findUnique({
        where: { websiteId: website.id },
        select: {
          provider: true,
          environment: true,
          publicKeyId: true,
          encryptedKeySecret: true,
          encryptedWebhookSecret: true,
          paymentsEnabled: true,
          verifiedAt: true,
        },
      });

    const nextPublicKey =
      body.publicKeyId === undefined
        ? existingPayment?.publicKeyId ?? null
        : body.publicKeyId?.trim() || null;

    const nextKeySecret =
      body.keySecret === undefined
        ? existingPayment?.encryptedKeySecret ?? null
        : encryptSecret(body.keySecret.trim());

    const nextWebhookSecret =
      body.webhookSecret === undefined
        ? existingPayment?.encryptedWebhookSecret ?? null
        : encryptSecret(body.webhookSecret.trim());

    const nextEnvironment =
      body.environment ?? existingPayment?.environment ?? "TEST";

    // Disabling is always allowed. Enabling payments requires credentials.
    if (
      body.paymentsEnabled === true &&
      (!nextPublicKey || !nextKeySecret || !nextWebhookSecret)
    ) {
      return ApiResponse.error({
        message:
          "Configure the Razorpay public key, key secret, and webhook secret before enabling payments.",
        code: "PAYMENT_CONFIGURATION_INCOMPLETE",
        status: 400,
      });
    }

// TEST payments require complete, previously verified credentials.
// Do not allow enabling payments while changing the configuration.
if (body.paymentsEnabled === true) {
  const credentialsReady =
    (body.provider ?? existingPayment?.provider) === "RAZORPAY" &&
    (body.environment ?? existingPayment?.environment) === "TEST" &&
    Boolean(nextPublicKey) &&
    Boolean(nextKeySecret) &&
    Boolean(nextWebhookSecret);

  const verificationStillValid =
    existingPayment?.verifiedAt != null &&
    body.provider === undefined &&
    body.environment === undefined &&
    body.publicKeyId === undefined &&
    body.keySecret === undefined &&
    body.webhookSecret === undefined;

  if (!credentialsReady || !verificationStillValid) {
    return ApiResponse.error({
      message:
        "Configure Razorpay TEST credentials, verify them, and save no payment configuration changes before enabling payments.",
      code: "PAYMENT_VERIFICATION_REQUIRED",
      status: 409,
    });
  }
}

    await prisma.$transaction(async (tx) => {
      const currentSettings = await tx.storeSettings.findUnique({
        where: { websiteId: website.id },
        select: { id: true },
      });

      const settingsData = {
        ...(body.storeEnabled !== undefined
          ? { storeEnabled: body.storeEnabled }
          : {}),
        ...(body.cartEnabled !== undefined
          ? { cartEnabled: body.cartEnabled }
          : {}),
        ...(body.guestCheckoutEnabled !== undefined
          ? { guestCheckoutEnabled: body.guestCheckoutEnabled }
          : {}),
        ...(defaultCurrency !== undefined
          ? { defaultCurrency }
          : {}),
        ...(body.shippingMode !== undefined
          ? { shippingMode: body.shippingMode }
          : {}),
      };

      if (currentSettings) {
        if (Object.keys(settingsData).length > 0) {
          await tx.storeSettings.update({
            where: { websiteId: website.id },
            data: settingsData,
          });
        }
      } else {
        await tx.storeSettings.create({
          data: {
            websiteId: website.id,
            ...settingsData,
          },
        });
      }

      const paymentData = {
        ...(body.provider !== undefined ? { provider: body.provider } : {}),
        ...(body.environment !== undefined
          ? { environment: body.environment }
          : {}),
        ...(body.publicKeyId !== undefined
          ? { publicKeyId: nextPublicKey }
          : {}),
        ...(body.keySecret !== undefined
          ? { encryptedKeySecret: nextKeySecret }
          : {}),
        ...(body.webhookSecret !== undefined
          ? { encryptedWebhookSecret: nextWebhookSecret }
          : {}),
        ...(body.paymentsEnabled !== undefined
          ? { paymentsEnabled: body.paymentsEnabled }
          : {}),
      };

      if (Object.keys(paymentData).length > 0) {
        await tx.storePaymentConfiguration.upsert({
          where: { websiteId: website.id },
          create: {
            websiteId: website.id,
            provider: body.provider ?? "RAZORPAY",
            environment: nextEnvironment,
            publicKeyId: nextPublicKey,
            encryptedKeySecret: nextKeySecret,
            encryptedWebhookSecret: nextWebhookSecret,
            paymentsEnabled: false,
          },
          update: {
            ...paymentData,
            // Changing credentials invalidates verification.
            ...(body.provider !== undefined ||
            body.environment !== undefined ||
            body.publicKeyId !== undefined ||
            body.keySecret !== undefined ||
            body.webhookSecret !== undefined
              ? {
                  verifiedAt: null,
                  paymentsEnabled: false,
                }
              : {}),
          },
        });
      }
    });

    return ApiResponse.success({
      message:
        "Store settings saved. Online checkout remains disabled until payment verification is implemented.",
      data: {
        saved: true,
        storeActivationPending: true,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
