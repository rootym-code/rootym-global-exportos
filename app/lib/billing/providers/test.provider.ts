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
  BillingProviderPaymentResult,
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

/**
 * ============================================================
 * Initial subscription checkout
 * ============================================================
 */
const testSubscriptionProvider: BillingSubscriptionProvider =
  {
    async createSubscriptionPayment(
      input: BillingSubscriptionRequest,
    ): Promise<BillingProviderPaymentResult> {
      const now = new Date();

      return {
        provider: "TEST",

        providerPaymentId:
          createTestPaymentId(
            "subscription_payment",
          ),

        providerSubscriptionId:
          `test_subscription_${Date.now()}_${Math.random()
            .toString(36)
            .slice(2, 10)}`,

        amount: input.amount,

        currency: input.currency,

        status: "CAPTURED",

        paidAt: now,

        failureCode: null,

        failureReason: null,

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
 */
const testPlanChangeProvider: BillingPlanChangeProvider =
  {
    async createPlanChangePayment(
      input: BillingPlanChangeRequest,
    ): Promise<BillingProviderPaymentResult> {
      const now = new Date();

      return {
        provider: "TEST",

        providerPaymentId:
          createTestPaymentId(
            "plan_change",
          ),

        providerSubscriptionId:
          null,

        amount:
          input.amount,

        currency:
          input.currency,

        status:
          "CAPTURED",

        paidAt:
          now,

        failureCode:
          null,

        failureReason:
          null,

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

  createSubscriptionPayment:
    testSubscriptionProvider.createSubscriptionPayment,

  createPlanChangePayment:
    testPlanChangeProvider.createPlanChangePayment,
};