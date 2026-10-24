
import { NextRequest } from "next/server";
import Razorpay from "razorpay";

import prisma from "@/lib/prisma";
import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import { decryptSecret } from "@/lib/utils/secret-encryption";

export async function POST(_request: NextRequest) {
  try {
    const { tenant, membership } = await requireWorkspaceAccess();

    if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
      return ApiResponse.error({
        message:
          "Only workspace owners and admins can verify payment credentials.",
        code: "PAYMENT_VERIFICATION_FORBIDDEN",
        status: 403,
      });
    }

    const website = await prisma.website.findUnique({
      where: { tenantId: tenant.id },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!website || !website.isActive) {
      return ApiResponse.error({
        message: "Customer website is not available.",
        code: "WEBSITE_NOT_AVAILABLE",
        status: 404,
      });
    }

    const payment = await prisma.storePaymentConfiguration.findUnique({
      where: { websiteId: website.id },
      select: {
        provider: true,
        environment: true,
        publicKeyId: true,
        encryptedKeySecret: true,
        encryptedWebhookSecret: true,
      },
    });

    if (
      !payment ||
      payment.provider !== "RAZORPAY" ||
      (payment.environment !== "TEST" &&
        payment.environment !== "LIVE")
    ) {
      return ApiResponse.error({
        message:
          "Configure Razorpay and select TEST or LIVE mode before verifying credentials.",
        code: "RAZORPAY_CONFIGURATION_REQUIRED",
        status: 409,
      });
    }

    const environment = payment.environment;

    if (
      !payment.publicKeyId ||
      !payment.encryptedKeySecret ||
      !payment.encryptedWebhookSecret
    ) {
      return ApiResponse.error({
        message:
          "Configure the Razorpay public key, key secret, and webhook secret first.",
        code: "PAYMENT_CONFIGURATION_INCOMPLETE",
        status: 400,
      });
    }

    let keySecret: string;

    try {
      keySecret = decryptSecret(payment.encryptedKeySecret);
    } catch {
      return ApiResponse.error({
        message:
          "The saved Razorpay key secret could not be decrypted. Please reconfigure it.",
        code: "PAYMENT_SECRET_DECRYPTION_FAILED",
        status: 500,
      });
    }

    try {
      const razorpay = new Razorpay({
        key_id: payment.publicKeyId,
        key_secret: keySecret,
      });

      // Verify the selected environment's API credentials.
      // This does not independently verify the webhook secret.
      await razorpay.orders.all({ count: 1 });
    } catch {
      return ApiResponse.error({
        message:
          `Razorpay rejected the ${environment.toLowerCase()} credentials or could not be reached. Check the selected environment's key ID and key secret, then try again.`,
        code: "RAZORPAY_CREDENTIALS_INVALID",
        status: 422,
      });
    }

    // Only mark credentials verified if the exact configuration
    // used for verification has not changed during the API request.
    const verifiedAt = new Date();

    const result = await prisma.storePaymentConfiguration.updateMany({
      where: {
        websiteId: website.id,
        provider: "RAZORPAY",
        environment,
        publicKeyId: payment.publicKeyId,
        encryptedKeySecret: payment.encryptedKeySecret,
        encryptedWebhookSecret: payment.encryptedWebhookSecret,
      },
      data: {
        verifiedAt,
        paymentsEnabled: false,
      },
    });

    if (result.count !== 1) {
      return ApiResponse.error({
        message:
          "Payment configuration changed during verification. Please verify the current configuration again.",
        code: "PAYMENT_CONFIGURATION_CHANGED",
        status: 409,
      });
    }

    return ApiResponse.success({
      message:
        `Razorpay ${environment.toLowerCase()} API credentials verified successfully. Online payments remain disabled.`,
      data: {
        verified: true,
        environment,
        paymentsEnabled: false,
        verifiedAt: verifiedAt.toISOString(),
        webhookSecretConfigured: true,
        webhookSecretIndependentlyVerified: false,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
