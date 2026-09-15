/**
 * Author: Prem Singh
 * Purpose: Provides the authenticated SaaS API for creating a Razorpay subscription for the current tenant after billing details validation.
 */

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  BillingInterval,
} from "@/lib/generated/prisma";

import {
  getCustomerSession,
} from "@/lib/auth/customer";

import {
  getBillingCustomerDetails,
} from "@/lib/services/billing/billing-customer-details.service";

import {
  createRazorpaySubscription,
  getRazorpayCheckoutKey,
} from "@/lib/services/billing/subscription.service";

function parseBillingInterval(
  value: unknown
): BillingInterval {
  if (
    value === BillingInterval.MONTHLY
  ) {
    return BillingInterval.MONTHLY;
  }

  if (
    value === BillingInterval.ANNUAL
  ) {
    return BillingInterval.ANNUAL;
  }

  throw new Error(
    "A valid billing interval is required. Choose MONTHLY or ANNUAL."
  );
}

export async function POST(
  request: NextRequest
) {
  try {
    /**
     * 1. Authenticate the SaaS customer.
     *
     * The tenant is always resolved from the
     * authenticated customer session. The browser
     * is never allowed to provide a tenantId.
     */
    const session =
      await getCustomerSession(request);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Customer authentication is required.",
        },
        {
          status: 401,
        }
      );
    }

    /**
     * 2. Require validated billing details.
     *
     * Billing details are saved through the dedicated
     * billing-customer-details endpoint before this
     * subscription endpoint is called. The server
     * checks the persisted tenant-scoped record here
     * rather than trusting browser state.
     *
     * This check intentionally uses getCustomerSession()
     * instead of requireCustomerSession(), because an
     * expired customer must be able to start a renewal
     * payment.
     */
    const billingDetails =
      await getBillingCustomerDetails(
        session.tenant.id
      );

    if (!billingDetails) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please complete your billing information before starting payment.",
        },
        {
          status: 400,
        }
      );
    }

    /**
     * 3. Read the requested billing interval.
     */
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "A valid JSON request body is required.",
        },
        {
          status: 400,
        }
      );
    }

    const billingInterval =
      parseBillingInterval(
        typeof body === "object" &&
          body !== null &&
          "billingInterval" in body
          ? (
              body as {
                billingInterval?: unknown;
              }
            ).billingInterval
          : undefined
      );

    /**
     * 4. Create the Razorpay subscription for
     *    the authenticated tenant.
     *
     * The service performs all tenant, plan,
     * duplicate-subscription, and Razorpay checks.
     *
     * Billing details are deliberately not passed
     * to Razorpay subscription creation here. They
     * remain in ROOTYM's billing subsystem and will
     * be snapshotted into the invoice after payment
     * is successfully captured.
     */
    const result =
      await createRazorpaySubscription({
        tenantId:
          session.tenant.id,
        billingInterval,
      });

    /**
     * 5. Return only the information required by
     *    the browser to initialize Razorpay Checkout.
     */
    return NextResponse.json(
      {
        success: true,
        message:
          "Razorpay subscription created successfully.",
        data: {
          subscriptionId:
            result.razorpay.subscriptionId,
          customerId:
            result.razorpay.customerId,
          status:
            result.razorpay.status,
          checkoutKey:
            getRazorpayCheckoutKey(),
          billingInterval,
          amount:
            result.subscription.amount,
          currency:
            result.subscription.currency,
          plan: {
            id:
              result.subscription.plan.id,
            code:
              result.subscription.plan.code,
            name:
              result.subscription.plan.name,
          },
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "POST /api/billing/subscription",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create the subscription.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 400,
      }
    );
  }
}
