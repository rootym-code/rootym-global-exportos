/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Creates a paid ROOTYM subscription plan change
 *          using the configured development billing provider.
 *
 * The generic billing provider may support multiple billing
 * capabilities. This route explicitly verifies that the
 * selected provider supports plan-change payments before
 * passing it to the plan-change domain service.
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
  testBillingProvider,
} from "@/app/lib/billing/providers/test.provider";

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
     * Resolve the Test Provider capability.
     * ========================================================
     *
     * The Test Provider is currently represented by the
     * generic BillingProvider contract.
     *
     * Plan changes require the more specific
     * BillingPlanChangeProvider capability.
     *
     * Keep this capability check here until the central
     * provider registry is introduced.
     * ========================================================
     */
    const createPlanChangePayment =
      testBillingProvider.createPlanChangePayment;

    if (!createPlanChangePayment) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The configured development billing provider does not support plan changes.",
        },
        {
          status: 501,
        },
      );
    }

    const planChangeProvider: BillingPlanChangeProvider =
      {
        createPlanChangePayment,
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
          "Payment successful. Your new plan has been paid for and will become effective when the current billing period ends.",

        data: {
          planChangeId:
            result.planChange.id,

          paymentId:
            result.payment.id,

          paymentStatus:
            result.payment.status,

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