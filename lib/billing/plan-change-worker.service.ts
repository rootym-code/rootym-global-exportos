/**
 * Author: Prem Singh
 * Purpose: Processes all due ROOTYM subscription plan changes for automatic scheduled billing execution.
 */

import prisma from "@/lib/prisma";

import {
  PlanChangeStatus,
} from "@/lib/generated/prisma";

import {
  applyDuePlanChange,
} from "@/lib/billing/plan-change-application.service";

/**
 * Maximum number of plan changes the worker will attempt
 * during a single execution.
 *
 * This is a safety limit for the scheduled worker. It prevents
 * an unexpectedly large backlog from causing an unbounded
 * execution time.
 */
const DEFAULT_BATCH_LIMIT = 100;

/**
 * Result returned for each tenant processed by the worker.
 */
export type PlanChangeWorkerTenantResult = {
  tenantId: string;
  appliedCount: number;
  status: "PROCESSED" | "FAILED";
  error?: string;
};

/**
 * Result returned by the complete worker execution.
 */
export type PlanChangeWorkerResult = {
  executionTime: Date;
  discoveredTenantCount: number;
  processedTenantCount: number;
  appliedCount: number;
  failedTenantCount: number;
  batchLimit: number;
  tenants: PlanChangeWorkerTenantResult[];
};

/**
 * Returns tenant IDs that currently have at least one
 * confirmed plan change whose effective date has been reached.
 *
 * The query deliberately filters on PAYMENT_CONFIRMED.
 *
 * PAYMENT_PENDING changes are never eligible for automatic
 * application.
 */
async function findDueTenantIds(
  now: Date,
  batchLimit: number,
): Promise<string[]> {
  const duePlanChanges =
    await prisma.subscriptionPlanChange.findMany({
      where: {
        status:
          PlanChangeStatus.PAYMENT_CONFIRMED,

        effectiveAt: {
          lte: now,
        },
      },

      select: {
        tenantId: true,
      },

      orderBy: {
        effectiveAt: "asc",
      },

      take: batchLimit,
    });

  /*
   * A tenant can have more than one due plan change.
   *
   * Process each tenant only once during discovery. The
   * tenant-level loop below will continue applying additional
   * due changes for that tenant.
   */
  return Array.from(
    new Set(
      duePlanChanges.map(
        (planChange) =>
          planChange.tenantId,
      ),
    ),
  );
}

/**
 * Processes all currently due plan changes for one tenant.
 *
 * applyDuePlanChange() applies exactly one due change at a time.
 * Therefore this function continues until that tenant has no
 * remaining due change.
 */
async function processTenantPlanChanges(
  tenantId: string,
  now: Date,
  remainingCapacity: number,
): Promise<number> {
  let appliedCount = 0;

  while (
    appliedCount <
    remainingCapacity
  ) {
    const result =
      await applyDuePlanChange({
        tenantId,
        now,
      });

    if (!result.applied) {
      break;
    }

    appliedCount += 1;
  }

  return appliedCount;
}

/**
 * Executes the automatic scheduled billing worker.
 *
 * The worker itself does not perform billing mutations directly.
 * It discovers eligible tenants and delegates the actual atomic
 * plan-change application to applyDuePlanChange().
 *
 * Each tenant is isolated from the others:
 *
 * - A successful tenant does not affect another tenant.
 * - A failed tenant is recorded and processing continues.
 * - The transaction inside applyDuePlanChange() rolls back
 *   the individual plan change if its subscription update fails.
 */
export async function processDuePlanChanges(
  input: {
    now?: Date;
    batchLimit?: number;
  } = {},
): Promise<PlanChangeWorkerResult> {
  const executionTime =
    input.now ?? new Date();

  const batchLimit =
    input.batchLimit ??
    DEFAULT_BATCH_LIMIT;

  if (
    !Number.isInteger(
      batchLimit,
    ) ||
    batchLimit < 1
  ) {
    throw new Error(
      "The worker batch limit must be a positive integer.",
    );
  }

  const tenantIds =
    await findDueTenantIds(
      executionTime,
      batchLimit,
    );

  const tenantResults: PlanChangeWorkerTenantResult[] =
    [];

  let totalAppliedCount = 0;

  /*
   * Process tenants sequentially.
   *
   * This keeps database pressure predictable and avoids
   * unnecessary concurrent billing mutations for the same
   * subscription.
   */
  for (
    const tenantId of tenantIds
  ) {
    const remainingCapacity =
      batchLimit -
      totalAppliedCount;

    if (
      remainingCapacity <= 0
    ) {
      break;
    }

    try {
      const appliedCount =
        await processTenantPlanChanges(
          tenantId,
          executionTime,
          remainingCapacity,
        );

      totalAppliedCount +=
        appliedCount;

      tenantResults.push({
        tenantId,
        appliedCount,
        status:
          "PROCESSED",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to process the tenant's scheduled plan changes.";

      /*
       * Do not abort the entire worker because one tenant
       * has an invalid/stale billing state.
       *
       * The failing tenant is recorded and the next tenant
       * continues to be processed.
       */
      tenantResults.push({
        tenantId,
        appliedCount: 0,
        status:
          "FAILED",
        error: message,
      });

      console.error(
        "Billing plan-change worker failed for tenant",
        {
          tenantId,
          error,
        },
      );
    }
  }

  const failedTenantCount =
    tenantResults.filter(
      (tenant) =>
        tenant.status ===
        "FAILED",
    ).length;

  return {
    executionTime,

    discoveredTenantCount:
      tenantIds.length,

    processedTenantCount:
      tenantResults.length,

    appliedCount:
      totalAppliedCount,

    failedTenantCount,

    batchLimit,

    tenants:
      tenantResults,
  };
}