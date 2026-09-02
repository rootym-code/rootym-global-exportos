/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Razorpay billing-provider integration
 *          for Test Mode subscription checkout operations.
 * ============================================================
 */

import type {
  BillingPlanChangeRequest,
  BillingProvider,
  BillingProviderCheckoutResult,
  BillingSubscriptionRequest,
} from "./types";

const RAZORPAY_API_BASE_URL =
  "https://api.razorpay.com/v1";

type RazorpayHttpMethod =
  | "GET"
  | "POST"
  | "PATCH";

interface RazorpayRequestOptions {
  method?: RazorpayHttpMethod;
  body?: unknown;
}

interface RazorpayErrorResponse {
  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: Record<string, unknown>;
  };
}

interface RazorpaySubscriptionResponse {
  id: string;
  entity?: string;
  plan_id?: string;
  status?: string;
  total_count?: number;
  paid_count?: number;
  remaining_count?: number;
  start_at?: number;
  charge_at?: number;
  end_at?: number;
  current_start?: number;
  current_end?: number;
  customer_id?: string;
  customer_notify?: boolean;
  short_url?: string | null;
  has_scheduled_changes?: boolean;
  change_scheduled_at?: number | null;
  notes?: Record<string, unknown>;
  created_at?: number;
}

function getRazorpayCredentials() {
  const keyId =
    process.env.RAZORPAY_KEY_ID?.trim();

  const keySecret =
    process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay credentials are not configured.",
    );
  }

  return {
    keyId,
    keySecret,
  };
}

function getRazorpayAuthorizationHeader(
  keyId: string,
  keySecret: string,
) {
  const encodedCredentials =
    Buffer.from(
      `${keyId}:${keySecret}`,
    ).toString("base64");

  return `Basic ${encodedCredentials}`;
}

async function razorpayRequest<T>(
  path: string,
  options: RazorpayRequestOptions = {},
): Promise<T> {
  const {
    keyId,
    keySecret,
  } = getRazorpayCredentials();

  const response = await fetch(
    `${RAZORPAY_API_BASE_URL}${path}`,
    {
      method:
        options.method ?? "GET",
      headers: {
        Authorization:
          getRazorpayAuthorizationHeader(
            keyId,
            keySecret,
          ),
        Accept: "application/json",
        ...(options.body !== undefined
          ? {
              "Content-Type":
                "application/json",
            }
          : {}),
      },
      body:
        options.body !== undefined
          ? JSON.stringify(options.body)
          : undefined,
      cache: "no-store",
    },
  );

  const responseText =
    await response.text();

  let responseBody: unknown = null;

  if (responseText) {
    try {
      responseBody =
        JSON.parse(responseText);
    } catch {
      responseBody =
        responseText;
    }
  }

  if (!response.ok) {
    const errorBody =
      responseBody as
        | RazorpayErrorResponse
        | null;

    const description =
      errorBody?.error?.description;

    throw new Error(
      description ||
        `Razorpay API request failed with status ${response.status}.`,
    );
  }

  return responseBody as T;
}

/**
 * Razorpay initial subscription checkout.
 *
 * The existing initial subscription flow is intentionally
 * preserved separately from the plan-change implementation.
 */
const razorpaySubscriptionProvider = {
  async createSubscriptionCheckout(
    _input: BillingSubscriptionRequest,
  ): Promise<never> {
    throw new Error(
      "Razorpay subscription checkout is not enabled yet. Complete Razorpay plan mapping before creating subscriptions.",
    );
  },
};

/**
 * Razorpay plan-change checkout.
 *
 * Creates the provider-side Razorpay Subscription without
 * completing payment.
 *
 * ROOTYM owns the business-effective date and its own billing
 * period dates. Provider-specific lifecycle dates are therefore
 * not supplied to Razorpay from the ROOTYM plan-change request.
 *
 * Razorpay returns its own subscription lifecycle dates, which
 * are retained as provider metadata for later reconciliation.
 */
const razorpayPlanChangeProvider = {
  async createPlanChangeCheckout(
    input: BillingPlanChangeRequest,
  ): Promise<BillingProviderCheckoutResult> {
    if (!input.razorpayPlanId) {
      throw new Error(
        "A Razorpay plan ID is required for the plan change.",
      );
    }

    if (!input.razorpayCustomerId) {
      throw new Error(
        "A Razorpay customer ID is required for the plan change.",
      );
    }

    if (
      !input.totalCount ||
      input.totalCount < 1
    ) {
      throw new Error(
        "A valid Razorpay subscription cycle count is required.",
      );
    }

    const {
      keyId,
    } = getRazorpayCredentials();

    /**
     * Provider-side subscription timing is intentionally
     * omitted here.
     *
     * ROOTYM maintains its own upcomingPeriodStart,
     * upcomingPeriodEnd, and effectiveAt values.
     *
     * Razorpay owns the provider-side subscription lifecycle.
     */
    const subscriptionPayload: Record<
      string,
      unknown
    > = {
      plan_id:
        input.razorpayPlanId,

      total_count:
        input.totalCount,

      customer_id:
        input.razorpayCustomerId,

      customer_notify:
        1,

      notes: {
        rootymTenantId:
          input.tenantId,

        rootymBillingInterval:
          input.toBillingInterval,

        rootymPlanChange:
          "true",
      },
    };

    const subscription =
      await razorpayRequest<RazorpaySubscriptionResponse>(
        "/subscriptions",
        {
          method: "POST",
          body:
            subscriptionPayload,
        },
      );

    if (!subscription?.id) {
      throw new Error(
        "Razorpay did not return a subscription ID.",
      );
    }

    return {
      provider: "RAZORPAY",

      providerCheckoutId:
        subscription.id,

      providerSubscriptionId:
        subscription.id,

      checkoutKey:
        keyId,

      checkoutUrl:
        subscription.short_url ??
        null,

      amount:
        input.amount,

      currency:
        input.currency,

      status:
        "CREATED",

      metadata: {
        razorpaySubscriptionId:
          subscription.id,

        razorpayPlanId:
          input.razorpayPlanId,

        razorpayStatus:
          subscription.status ??
          null,

        razorpayStartAt:
          subscription.start_at ??
          null,

        razorpayEndAt:
          subscription.end_at ??
          null,

        razorpayCurrentStart:
          subscription.current_start ??
          null,

        razorpayCurrentEnd:
          subscription.current_end ??
          null,

        chargeAt:
          subscription.charge_at ??
          null,

        totalCount:
          subscription.total_count ??
          input.totalCount,
      },
    };
  },
};

export const razorpayApi = {
  request:
    razorpayRequest,
};

export const razorpayBillingProvider: BillingProvider =
  {
    name: "RAZORPAY",

    createSubscriptionCheckout:
      razorpaySubscriptionProvider.createSubscriptionCheckout,

    createPlanChangeCheckout:
      razorpayPlanChangeProvider.createPlanChangeCheckout,
  };