
import { NextRequest } from "next/server";
import { acquireStorePaymentLock } from "@/lib/services/store-payment-lock.service";
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
    livePublicKeyId: true,
liveEncryptedKeySecret: true,
liveEncryptedWebhookSecret: true,
livePaymentsEnabled: true,
liveVerifiedAt: true,
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
      // Return safe metadata for both environments so the form can switch
      // between TEST and LIVE without displaying or returning stored secrets.
      environments: {
        TEST: {
          publicKeyId: payment.publicKeyId,
          paymentsEnabled: payment.paymentsEnabled,
          verifiedAt: payment.verifiedAt,
          secretsConfigured: {
            keySecret: Boolean(payment.encryptedKeySecret),
            webhookSecret: Boolean(payment.encryptedWebhookSecret),
          },
        },
        LIVE: {
          publicKeyId: payment.livePublicKeyId,
          paymentsEnabled: payment.livePaymentsEnabled,
          verifiedAt: payment.liveVerifiedAt,
          secretsConfigured: {
            keySecret: Boolean(payment.liveEncryptedKeySecret),
            webhookSecret: Boolean(payment.liveEncryptedWebhookSecret),
          },
        },
      },
      // Keep these selected-environment fields for compatibility with any
      // existing consumers of this endpoint.
      publicKeyId:
        payment.environment === "LIVE"
          ? payment.livePublicKeyId
          : payment.publicKeyId,
      paymentsEnabled:
        payment.environment === "LIVE"
          ? payment.livePaymentsEnabled
          : payment.paymentsEnabled,
      verifiedAt:
        payment.environment === "LIVE"
          ? payment.liveVerifiedAt
          : payment.verifiedAt,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    }
  : null,
secretsConfigured: {
  keySecret:
    payment?.environment === "LIVE"
      ? Boolean(payment.liveEncryptedKeySecret)
      : Boolean(payment?.encryptedKeySecret),
  webhookSecret:
    payment?.environment === "LIVE"
      ? Boolean(payment.liveEncryptedWebhookSecret)
      : Boolean(payment?.encryptedWebhookSecret),
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
  credentialsEnvironment?: string;
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
        if (
      body.credentialsEnvironment !== undefined &&
      body.credentialsEnvironment !== "TEST" &&
      body.credentialsEnvironment !== "LIVE"
    ) {
      return ApiResponse.error({
        message: "Credentials environment must be TEST or LIVE.",
        code: "INVALID_CREDENTIALS_ENVIRONMENT",
        status: 400,
      });
    }
    for (const field of ["keySecret", "webhookSecret"] as const) {
      const value = body[field];
          if (
        value !== undefined &&
        (typeof value !== "string" ||
          (typeof value === "string" &&
            (value.trim().length === 0 || value.length > 2000))
        )
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
          websiteId: true,
          provider: true,
          environment: true,
          publicKeyId: true,
          encryptedKeySecret: true,
          encryptedWebhookSecret: true,
          paymentsEnabled: true,
          verifiedAt: true,
          livePublicKeyId: true,
liveEncryptedKeySecret: true,
liveEncryptedWebhookSecret: true,
livePaymentsEnabled: true,
liveVerifiedAt: true,
        },
      });
const nextEnvironment =
body.credentialsEnvironment ??
body.environment ??
existingPayment?.environment ??
"TEST";  
    const nextPublicKey =
      body.publicKeyId === undefined
        ? nextEnvironment === "LIVE"
          ? existingPayment?.livePublicKeyId ?? null
          : existingPayment?.publicKeyId ?? null
        : body.publicKeyId?.trim() || null;
        const nextKeySecret =
      body.keySecret === undefined
        ? nextEnvironment === "LIVE"
          ? existingPayment?.liveEncryptedKeySecret ?? null
          : existingPayment?.encryptedKeySecret ?? null
        : encryptSecret(body.keySecret.trim());
    
    const nextWebhookSecret =
      body.webhookSecret === undefined
        ? nextEnvironment === "LIVE"
          ? existingPayment?.liveEncryptedWebhookSecret ?? null
          : existingPayment?.encryptedWebhookSecret ?? null
        : encryptSecret(body.webhookSecret.trim());
        const nextVerifiedAt =
      nextEnvironment === "LIVE"
        ? existingPayment?.liveVerifiedAt
        : existingPayment?.verifiedAt;

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
// Payments can be enabled only with previously verified credentials
// for the currently configured environment.
if (body.paymentsEnabled === true) {
  const credentialsReady =
    (body.provider ?? existingPayment?.provider) === "RAZORPAY" &&
    (nextEnvironment === "TEST" || nextEnvironment === "LIVE") &&
    Boolean(nextPublicKey) &&
    Boolean(nextKeySecret) &&
    Boolean(nextWebhookSecret);

    const verificationStillValid =
    nextVerifiedAt != null &&
    existingPayment?.verifiedAt != null &&
    body.provider === undefined &&
    body.environment === undefined &&
    body.publicKeyId === undefined &&
    body.keySecret === undefined &&
    body.credentialsEnvironment === undefined &&
    body.webhookSecret === undefined
  if (!credentialsReady || !verificationStillValid) {
    return ApiResponse.error({
      message:
        "Configure and verify the Razorpay credentials for the selected environment, then enable payments without changing the payment configuration.",
      code: "PAYMENT_VERIFICATION_REQUIRED",
      status: 409,
    });
  }
}
const transactionResult = await prisma.$transaction(async (tx) => {
  await acquireStorePaymentLock(tx, website.id);

  // Read the payment environment only after acquiring the shared lock.
  const currentPayment = await tx.storePaymentConfiguration.findUnique({
    where: { websiteId: website.id },
    select: {
      websiteId: true,
      provider: true,
      environment: true,
      publicKeyId: true,
      encryptedKeySecret: true,
      encryptedWebhookSecret: true,
      paymentsEnabled: true,
      verifiedAt: true,
      livePublicKeyId: true,
liveEncryptedKeySecret: true,
liveEncryptedWebhookSecret: true,
livePaymentsEnabled: true,
liveVerifiedAt: true,
    },
  });

    // Recalculate the effective configuration from the fresh, locked row.

    const lockedNextEnvironment =
    body.credentialsEnvironment ??
    body.environment ??
    currentPayment?.environment ??
    "TEST";
  
  
  const lockedNextPublicKey =
    body.publicKeyId === undefined
      ? lockedNextEnvironment === "LIVE"
        ? currentPayment?.livePublicKeyId ?? null
        : currentPayment?.publicKeyId ?? null
      : body.publicKeyId?.trim() || null;
  
  const lockedNextKeySecret =
    body.keySecret === undefined
      ? lockedNextEnvironment === "LIVE"
        ? currentPayment?.liveEncryptedKeySecret ?? null
        : currentPayment?.encryptedKeySecret ?? null
      : encryptSecret(body.keySecret.trim());
  
  const lockedNextWebhookSecret =
    body.webhookSecret === undefined
      ? lockedNextEnvironment === "LIVE"
        ? currentPayment?.liveEncryptedWebhookSecret ?? null
        : currentPayment?.encryptedWebhookSecret ?? null
      : encryptSecret(body.webhookSecret.trim());
  
  const lockedNextVerifiedAt =
    lockedNextEnvironment === "LIVE"
      ? currentPayment?.liveVerifiedAt
      : currentPayment?.verifiedAt;

  // Revalidate payment activation against the fresh configuration.
  if (
    body.paymentsEnabled === true &&
    (!lockedNextPublicKey ||
      !lockedNextKeySecret ||
      !lockedNextWebhookSecret)
  ) {
    return {
      error: ApiResponse.error({
        message:
          "Configure the Razorpay public key, key secret, and webhook secret before enabling payments.",
        code: "PAYMENT_CONFIGURATION_INCOMPLETE",
        status: 400,
      }),
    };
  }

  if (body.paymentsEnabled === true) {
    const credentialsReady =
      (body.provider ?? currentPayment?.provider) === "RAZORPAY" &&
      (lockedNextEnvironment === "TEST" ||
        lockedNextEnvironment === "LIVE") &&
      Boolean(lockedNextPublicKey) &&
      Boolean(lockedNextKeySecret) &&
      Boolean(lockedNextWebhookSecret);

    const verificationStillValid =
    lockedNextVerifiedAt != null &&
      body.provider === undefined &&
      body.environment === undefined &&
      body.publicKeyId === undefined &&
      body.keySecret === undefined &&
      body.credentialsEnvironment === undefined &&
      body.webhookSecret === undefined


    if (!credentialsReady || !verificationStillValid) {
      return {
        error: ApiResponse.error({
          message:
            "Configure and verify the Razorpay credentials for the selected environment, then enable payments without changing the payment configuration.",
          code: "PAYMENT_VERIFICATION_REQUIRED",
          status: 409,
        }),
      };
    }
  }

  // Do not switch environments while unpaid orders from the previous
  // environment still require payment or recovery.
  if (
    currentPayment &&
    body.environment !== undefined &&
    body.environment !== currentPayment.environment
  ) {
    const pendingOrders = await tx.storeOrder.count({
      where: {
        websiteId: website.id,
        status: "PENDING_PAYMENT",
        providerEnvironment: {
          not: body.environment as "TEST" | "LIVE",
        },
      },
    });

    if (pendingOrders > 0) {
      return {
        error: ApiResponse.error({
          message:
            "The payment environment cannot be changed while unpaid orders remain in the previous environment. Resolve or formally cancel those orders first.",
          code: "PENDING_ORDERS_PREVENT_ENVIRONMENT_SWITCH",
          status: 409,
        }),
      };
    }
  }

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


      const isLiveEnvironment = lockedNextEnvironment === "LIVE";

      const credentialFields = isLiveEnvironment
        ? {
            publicKeyId: "livePublicKeyId" as const,
            keySecret: "liveEncryptedKeySecret" as const,
            webhookSecret: "liveEncryptedWebhookSecret" as const,
            paymentsEnabled: "livePaymentsEnabled" as const,
            verifiedAt: "liveVerifiedAt" as const,
          }
        : {
            publicKeyId: "publicKeyId" as const,
            keySecret: "encryptedKeySecret" as const,
            webhookSecret: "encryptedWebhookSecret" as const,
            paymentsEnabled: "paymentsEnabled" as const,
            verifiedAt: "verifiedAt" as const,
          };

      const credentialsChanged =
        body.publicKeyId !== undefined ||
        body.keySecret !== undefined ||
        body.webhookSecret !== undefined;

      const paymentData = {
        ...(body.provider !== undefined ? { provider: body.provider } : {}),
        ...(body.environment !== undefined
          ? { environment: lockedNextEnvironment }
          : {}),
        ...(body.publicKeyId !== undefined
          ? { [credentialFields.publicKeyId]: lockedNextPublicKey }
          : {}),
        ...(body.keySecret !== undefined
          ? { [credentialFields.keySecret]: lockedNextKeySecret }
          : {}),
        ...(body.webhookSecret !== undefined
          ? { [credentialFields.webhookSecret]: lockedNextWebhookSecret }
          : {}),
        ...(body.paymentsEnabled !== undefined
          ? { [credentialFields.paymentsEnabled]: body.paymentsEnabled }
          : {}),
        ...(body.provider !== undefined || credentialsChanged
          ? {
              [credentialFields.verifiedAt]: null,
              [credentialFields.paymentsEnabled]: false,
            }
          : {}),
      };

      if (Object.keys(paymentData).length > 0) {
        await tx.storePaymentConfiguration.upsert({
          where: { websiteId: website.id },
          create: {
            websiteId: website.id,
            provider: body.provider ?? "RAZORPAY",
            environment: lockedNextEnvironment,
            publicKeyId: null,
            encryptedKeySecret: null,
            encryptedWebhookSecret: null,
            paymentsEnabled: false,
            livePaymentsEnabled: false,
            liveVerifiedAt: null,
            ...(isLiveEnvironment
              ? {
                  livePublicKeyId: lockedNextPublicKey,
                  liveEncryptedKeySecret: lockedNextKeySecret,
                  liveEncryptedWebhookSecret: lockedNextWebhookSecret,
                }
              : {
                  publicKeyId: lockedNextPublicKey,
                  encryptedKeySecret: lockedNextKeySecret,
                  encryptedWebhookSecret: lockedNextWebhookSecret,
                }),
          },
          update: paymentData,
        });
      }
      return { error: null };
    });

    if (transactionResult.error) {
      return transactionResult.error;
    }

    return ApiResponse.success({
      message:
      "Store settings saved. Payment configuration changes require verification before online checkout can be enabled.",
      data: {
        saved: true,
        storeActivationPending: true,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
