/**
 * Author: Prem Singh
 * Purpose: Provides the server-side Razorpay API client for ROOTYM SaaS billing and payment verification.
 */

const RAZORPAY_API_BASE_URL =
  "https://api.razorpay.com/v1";

function getRazorpayCredentials() {
  const keyId =
    process.env.RAZORPAY_KEY_ID;

  const keySecret =
    process.env.RAZORPAY_KEY_SECRET;

  if (!keyId) {
    throw new Error(
      "RAZORPAY_KEY_ID is not configured."
    );
  }

  if (!keySecret) {
    throw new Error(
      "RAZORPAY_KEY_SECRET is not configured."
    );
  }

  return {
    keyId,
    keySecret,
  };
}

function createAuthorizationHeader(
  keyId: string,
  keySecret: string
) {
  return `Basic ${Buffer.from(
    `${keyId}:${keySecret}`
  ).toString("base64")}`;
}

export async function razorpayRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PATCH";
    body?: Record<string, unknown>;
  } = {}
): Promise<T> {
  const {
    keyId,
    keySecret,
  } =
    getRazorpayCredentials();

  const method =
    options.method ?? "GET";

  const response =
    await fetch(
      `${RAZORPAY_API_BASE_URL}${path}`,
      {
        method,

        headers: {
          Authorization:
            createAuthorizationHeader(
              keyId,
              keySecret
            ),

          "Content-Type":
            "application/json",
        },

        body: options.body
          ? JSON.stringify(
              options.body
            )
          : undefined,

        cache: "no-store",
      }
    );

  const responseText =
    await response.text();

  let responseData: unknown =
    null;

  if (responseText) {
    try {
      responseData =
        JSON.parse(
          responseText
        );
    } catch {
      responseData =
        responseText;
    }
  }

  if (!response.ok) {
    const message =
      typeof responseData ===
        "object" &&
      responseData !== null &&
      "error" in responseData &&
      typeof (
        responseData as {
          error?: {
            description?: unknown;
          };
        }
      ).error?.description ===
        "string"
        ? (
            responseData as {
              error: {
                description: string;
              };
            }
          ).error.description
        : `Razorpay API request failed with status ${response.status}.`;

    throw new Error(
      message
    );
  }

  return responseData as T;
}

/**
 * Author: Prem Singh
 * Purpose: Returns the configured Razorpay public key ID for Checkout initialization.
 */

export function getRazorpayKeyId() {
  return getRazorpayCredentials()
    .keyId;
}

/**
 * Author: Prem Singh
 * Purpose: Retrieves a Razorpay payment from the server for authoritative payment-state verification.
 */

export async function getRazorpayPayment(
  paymentId: string
) {
  if (!paymentId) {
    throw new Error(
      "A valid Razorpay payment ID is required."
    );
  }

  return razorpayRequest<{
    id: string;
    entity?: string;
    amount?: number;
    currency?: string;
    status?: string;
    order_id?: string | null;
    invoice_id?: string | null;
    subscription_id?: string | null;
    error_code?: string | null;
    error_description?: string | null;
    created_at?: number;
  }>(
    `/payments/${encodeURIComponent(
      paymentId
    )}`
  );
}

/**
 * Author: Prem Singh
 * Purpose: Retrieves a Razorpay subscription from the server for authoritative subscription-state verification.
 */

export async function getRazorpaySubscription(
  subscriptionId: string
) {
  if (!subscriptionId) {
    throw new Error(
      "A valid Razorpay subscription ID is required."
    );
  }

  return razorpayRequest<{
    id: string;
    entity?: string;
    plan_id?: string;
    customer_id?: string;
    status?: string;
    current_start?: number | null;
    current_end?: number | null;
    charge_at?: number | null;
    start_at?: number | null;
    end_at?: number | null;
    total_count?: number;
    paid_count?: number;
    remaining_count?: number;
  }>(
    `/subscriptions/${encodeURIComponent(
      subscriptionId
    )}`
  );
}