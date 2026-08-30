/**
 * Author: Prem Singh
 * Purpose: Provides a deterministic local payment provider for billing development and end-to-end testing without Razorpay.
 */

import type {
    BillingPlanChangeProvider,
    BillingPlanChangeRequest,
    BillingProviderPaymentResult,
  } from "./types";
  
  function createTestPaymentId() {
    return `test_plan_change_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }
  
  export const testBillingProvider: BillingPlanChangeProvider =
    {
      async createPlanChangePayment(
        input: BillingPlanChangeRequest,
      ): Promise<BillingProviderPaymentResult> {
        const now = new Date();
  
        return {
          provider: "TEST",
  
          providerPaymentId:
            createTestPaymentId(),
  
          providerSubscriptionId:
            null,
  
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
              "PLAN_CHANGE",
  
            fromBillingInterval:
              input.fromBillingInterval,
  
            toBillingInterval:
              input.toBillingInterval,
          },
        };
      },
    };