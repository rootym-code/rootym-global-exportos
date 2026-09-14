/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the protected automatic billing worker endpoint for
 *          applying due ROOTYM subscription plan changes and expiring
 *          completed ROOTYM free trials.
 * ============================================================
 */

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  processDuePlanChanges,
} from "@/lib/billing/plan-change-worker.service";

import {
  expireTrialSubscriptions,
} from "@/lib/services/billing/subscription-lifecycle.service";

/**
 * Verifies that the request was made by the configured
 * billing scheduler.
 *
 * The secret is never accepted through the request body,
 * query string, or tenant headers.
 */
function isAuthorized(
  request: NextRequest,
): boolean {
  const configuredSecret =
    process.env.BILLING_PLAN_CHANGE_CRON_SECRET;

  if (!configuredSecret) {
    throw new Error(
      "BILLING_PLAN_CHANGE_CRON_SECRET is not configured.",
    );
  }

  const authorization =
    request.headers.get(
      "authorization",
    );

  if (!authorization) {
    return false;
  }

  const [scheme, token] =
    authorization.split(" ");

  if (
    scheme !== "Bearer" ||
    !token
  ) {
    return false;
  }

  return token === configuredSecret;
}

/**
 * Resolves the worker execution time.
 *
 * Normal scheduled execution always uses the actual server
 * time.
 *
 * The optional override exists only for local development
 * testing so an effective-date transition can be tested
 * without modifying database dates.
 */
function getExecutionTime(
  request: NextRequest,
): Date {
  const requestedTime =
    request.headers.get(
      "x-rootym-test-now",
    );

  if (!requestedTime) {
    return new Date();
  }

  if (
    process.env.NODE_ENV !==
    "development"
  ) {
    throw new Error(
      "The test execution-time override is available only in development.",
    );
  }

  const parsedTime =
    new Date(requestedTime);

  if (
    Number.isNaN(
      parsedTime.getTime(),
    )
  ) {
    throw new Error(
      "The x-rootym-test-now header must contain a valid ISO date/time.",
    );
  }

  return parsedTime;
}

export async function POST(
  request: NextRequest,
) {
  try {
    /**
     * ========================================================
     * This endpoint is exclusively for the automatic
     * billing scheduler.
     *
     * It does not use customer authentication and does
     * not accept a tenant ID.
     * ========================================================
     */
    if (
      !isAuthorized(request)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    /**
     * ========================================================
     * Resolve the execution time.
     *
     * Production cron execution uses the actual current
     * server time.
     * ========================================================
     */
    const executionTime =
      getExecutionTime(
        request,
      );

    /**
     * ========================================================
     * Process both automatic subscription lifecycle jobs:
     *
     * 1. Apply due confirmed plan changes.
     * 2. Expire completed free trials.
     *
     * Both workers operate independently across tenants.
     * ========================================================
     */
    const [
      planChangeResult,
      trialExpiryResult,
    ] = await Promise.all([
      processDuePlanChanges({
        now: executionTime,
      }),
      expireTrialSubscriptions(
        executionTime,
      ),
    ]);

    const hasLifecycleChanges =
      planChangeResult.appliedCount > 0 ||
      trialExpiryResult.expiredCount > 0;

    return NextResponse.json(
      {
        success: true,
        message:
          hasLifecycleChanges
            ? "ROOTYM subscription lifecycle processing completed successfully."
            : "No due billing plan changes or expired trials were found.",
        data: {
          executionTime:
            executionTime,
          planChanges: {
            discoveredTenantCount:
              planChangeResult.discoveredTenantCount,
            processedTenantCount:
              planChangeResult.processedTenantCount,
            appliedCount:
              planChangeResult.appliedCount,
            failedTenantCount:
              planChangeResult.failedTenantCount,
            batchLimit:
              planChangeResult.batchLimit,
            tenants:
              planChangeResult.tenants,
          },
          trialExpiry: {
            expiredCount:
              trialExpiryResult.expiredCount,
          },
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "POST /api/cron/billing/plan-change",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to process scheduled billing subscription lifecycle.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 500,
      },
    );
  }
}
