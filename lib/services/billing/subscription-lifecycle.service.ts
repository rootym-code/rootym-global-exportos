/**
 * Author: Prem Singh
 * Purpose: Process expired ROOTYM free-trial subscriptions and mark them EXPIRED.
 */

import prisma from "@/lib/prisma";
import { SubscriptionStatus } from "@/lib/generated/prisma";

export interface TrialExpiryResult {
  executionTime: Date;
  expiredCount: number;
}

export async function expireTrialSubscriptions(
  now: Date = new Date()
): Promise<TrialExpiryResult> {
  const result = await prisma.subscription.updateMany({
    where: {
      status: SubscriptionStatus.TRIALING,
      trialEndsAt: {
        not: null,
        lte: now,
      },
    },
    data: {
      status: SubscriptionStatus.EXPIRED,
    },
  });

  return {
    executionTime: now,
    expiredCount: result.count,
  };
}
