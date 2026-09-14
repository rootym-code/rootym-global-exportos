/**
 * Author: Prem Singh
 * Purpose: Run the V1 subscription lifecycle processing for expired ROOTYM trials.
 */

import {
    expireTrialSubscriptions,
    TrialExpiryResult,
  } from "@/lib/services/billing/subscription-lifecycle.service";
  
  export interface SubscriptionLifecycleWorkerResult {
    executionTime: Date;
    expiredTrialCount: number;
  }
  
  export async function processSubscriptionLifecycle(
    now: Date = new Date()
  ): Promise<SubscriptionLifecycleWorkerResult> {
    const result: TrialExpiryResult = await expireTrialSubscriptions(now);
  
    return {
      executionTime: result.executionTime,
      expiredTrialCount: result.expiredCount,
    };
  }