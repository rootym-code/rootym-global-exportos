/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Creates a paid ROOTYM subscription plan change
 *          using the first enabled billing provider configured
 *          for the active billing environment.
 *
 * The selected provider is resolved through the central billing
 * provider registry and environment configuration.
 * ============================================================
 */

import { NextResponse } from "next/server";

import { cookies } from "next/headers";

import {
  BillingInterval,
} from "@/lib/generated/prisma";

import {
  verifyCustomerToken,
  CUSTOMER_AUTH_COOKIE_NAME,
} from "@/lib/auth/customer-jwt";

import {
  createPaidPlanChange,
} from "@/app/lib/billing/plan-change.service";

import {
  getConfiguredBillingProviders,
} from "@/app/lib/billing/providers";

import type {
  BillingPlanChangeProvider,
} from "@/app/lib/billing/providers/types";

export async function POST(
  request: Request,
) {
  try {
    const cookieStore =
      await cookies();

    const token =
      cookieStore.get(
        CUSTOMER_AUTH_COOKIE_NAME,
      )?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Authentication is required.",
        },
        {
          status: 401,
        },
      );
    }

    const session =
      await verifyCustomerToken(
        token,
      );

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid customer session.",
        },
        {
          status: 401,
        },
      );
    }

    let body: {
      billingInterval?: string;
    };

    try {
      body =
        (await request.json()) as {
          billingInterval?: string;
        };
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "A valid JSON request body is required.",
        },
        {
          status: 400,
        },
      );
    }

    const billingInterval =
      body.billingInterval ===
      "ANNUAL"
        ? BillingInterval.ANNUAL
        : body.billingInterval ===
            "MONTHLY"
          ? BillingInterval.MONTHLY
          : null;

    if (!billingInterval) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A valid billing interval is required.",
        },
        {
          status: 400,
        },
      );
    }

    /**
     * ========================================================
     * Resolve the first enabled billing provider.
     * ========================================================
     *
     * Providers are resolved through the central billing
     * provider registry and BillingProviderConfig.
     *
     * getConfiguredBillingProviders() already orders providers
     * by sortOrder ASC and provider name.
     *
     * The first enabled provider is therefore the provider
     * selected for this plan-change request.
     * ========================================================
     */

    const configuredProviders =
      await getConfiguredBillingProviders();

    const selectedProvider =
      configuredProviders[0];

    if (!selectedProvider) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No enabled billing provider is configured for the active billing environment.",
        },
        {
          status: 503,
        },
      );
    }

    /**
     * ========================================================
     * Resolve the plan-change checkout capability.
     * ========================================================
     *
     * Not every billing provider is required to support
     * plan-change checkout.
     *
     * The capability is therefore checked explicitly before
     * passing the provider to the plan-change domain service.
     * ========================================================
     */

    const createPlanChangeCheckout =
      selectedProvider.createPlanChangeCheckout;

    if (!createPlanChangeCheckout) {
      return NextResponse.json(
        {
          success: false,
          message:
            `The configured billing provider ${selectedProvider.displayName} does not support plan-change checkout.`,
        },
        {
          status: 501,
        },
      );
    }

    const planChangeProvider:
      BillingPlanChangeProvider =
      {
        createPlanChangeCheckout,
      };

    /**
     * ========================================================
     * Execute provider-independent plan-change billing.
     * ========================================================
     */

    const result =
      await createPaidPlanChange({
        tenantId:
          session.tenantId,

        billingInterval,

        provider:
          planChangeProvider,
      });

    return NextResponse.json(
      {
        success: true,



        message:
        "Plan-change checkout initialized. Complete the payment to confirm your new plan.",

      data: {
        planChangeId:
          result.planChange.id,

        provider:
          result.provider,

        checkout: {
          providerCheckoutId:
            result.checkout
              .providerCheckoutId,

          providerSubscriptionId:
            result.checkout
              .providerSubscriptionId,

          checkoutKey:
            result.checkout
              .checkoutKey,

          checkoutUrl:
            result.checkout
              .checkoutUrl,

          amount:
            result.checkout.amount,

          currency:
            result.checkout.currency,

          status:
            result.checkout.status,

          metadata:
            result.checkout.metadata,
        },

        planChangeStatus:
          result.planChange.status,

        currentPlan: {
          code:
            result.planChange
              .fromPlan.code,

          name:
            result.planChange
              .fromPlan.name,
        },

        targetPlan: {
          code:
            result.planChange
              .toPlan.code,

          name:
            result.planChange
              .toPlan.name,
        },

        effectiveAt:
          result.planChange
            .effectiveAt,
      },




      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/billing/plan-change",
      error,
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to change the billing plan.",
      },
      {
        status: 500,
      },
    );
  }
}
