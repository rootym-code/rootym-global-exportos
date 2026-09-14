/**
 * Author: Prem Singh
 * Purpose: Secure cron endpoint for processing expired ROOTYM trial subscriptions.
 */

import { NextRequest, NextResponse } from "next/server";
import { processSubscriptionLifecycle } from "@/lib/billing/subscription-lifecycle-worker.service";

function isAuthorized(request: NextRequest): boolean {
  const configuredSecret =
    process.env.BILLING_SUBSCRIPTION_LIFECYCLE_CRON_SECRET;

  if (!configuredSecret) {
    return false;
  }

  const authorization = request.headers.get("authorization");

  if (!authorization) {
    return false;
  }

  return authorization === `Bearer ${configuredSecret}`;
}

function getExecutionTime(request: NextRequest): Date {
  const testNow = request.headers.get("x-rootym-test-now");

  if (
    process.env.NODE_ENV === "development" &&
    testNow
  ) {
    const parsed = new Date(testNow);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }

    throw new Error("Invalid x-rootym-test-now value.");
  }

  return new Date();
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const executionTime = getExecutionTime(request);

    const result = await processSubscriptionLifecycle(
      executionTime
    );

    return NextResponse.json({
      success: true,
      executionTime: result.executionTime.toISOString(),
      expiredTrialCount: result.expiredTrialCount,
    });
  } catch (error) {
    console.error(
      "Subscription lifecycle cron failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Subscription lifecycle processing failed.",
      },
      { status: 500 }
    );
  }
}