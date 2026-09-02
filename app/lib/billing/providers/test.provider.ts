/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides a deterministic billing provider for
 *          development and end-to-end billing testing without
 *          requiring an external payment gateway.
 * ============================================================
 */

import type {
  BillingPlanChangeProvider,
  BillingPlanChangeRequest,
  BillingProviderCheckoutResult,
  BillingProvider,
  BillingSubscriptionProvider,
  BillingSubscriptionRequest,
} from "./types";

function createTestPaymentId(
  operation: string,
) {
  return `test_${operation.toLowerCase()}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function createTestSubscriptionId() {
  return `test_subscription_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

/**
 * ============================================================
 * Initial subscription checkout
 * ============================================================
 *
 * The TEST provider simulates a completed checkout
 * immediately. This preserves the existing development
 * behavior without requiring an external payment gateway.
 */
const testSubscriptionProvider: BillingSubscriptionProvider =
  {
    async createSubscriptionCheckout(
      input: BillingSubscriptionRequest,
    ): Promise<BillingProviderCheckoutResult> {
      return {
        provider: "TEST",

        providerCheckoutId:
          createTestPaymentId(
            "subscription_checkout",
          ),

        providerSubscriptionId:
          createTestSubscriptionId(),

        checkoutKey: null,

        checkoutUrl: null,

        amount: input.amount,

        currency: input.currency,

        status: "CAPTURED",

        metadata: {
          testMode: true,

          simulated: true,

          operation:
            "INITIAL_SUBSCRIPTION",

          tenantId:
            input.tenantId,

          planId:
            input.planId,

          billingInterval:
            input.billingInterval,
        },
      };
    },
  };

/**
 * ============================================================
 * Paid plan change
 * ============================================================
 *
 * The TEST provider simulates the plan-change checkout
 * immediately. No external payment gateway is required.
 */
const testPlanChangeProvider: BillingPlanChangeProvider =
  {
    async createPlanChangeCheckout(
      input: BillingPlanChangeRequest,
    ): Promise<BillingProviderCheckoutResult> {
      return {
        provider: "TEST",

        providerCheckoutId:
          createTestPaymentId(
            "plan_change_checkout",
          ),

        providerSubscriptionId:
          null,

        checkoutKey: null,

        checkoutUrl: null,

        amount:
          input.amount,

        currency:
          input.currency,

        status:
          "CAPTURED",

        metadata: {
          testMode:
            true,

          simulated:
            true,

          operation:
            "PLAN_CHANGE",

          tenantId:
            input.tenantId,

          fromBillingInterval:
            input.fromBillingInterval,

          toBillingInterval:
            input.toBillingInterval,
        },
      };
    },
  };

/**
 * ============================================================
 * Combined Test Billing Provider
 * ============================================================
 */
export const testBillingProvider: BillingProvider = {
  name: "TEST",

  createSubscriptionCheckout:
    testSubscriptionProvider.createSubscriptionCheckout,

  createPlanChangeCheckout:
    testPlanChangeProvider.createPlanChangeCheckout,
};