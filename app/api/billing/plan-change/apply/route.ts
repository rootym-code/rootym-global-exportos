/**
 * Author: Prem Singh
 * Purpose: Provides a protected internal endpoint for applying due ROOTYM subscription plan changes.
 */

import {
    NextRequest,
    NextResponse,
  } from "next/server";
  
  import {
    applyDuePlanChange,
  } from "@/lib/billing/plan-change-application.service";
  
  function isAuthorized(
    request: NextRequest,
  ) {
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
  
  function getExecutionTime(
    request: NextRequest,
  ) {
    /*
     * The normal execution time is the actual
     * server time.
     *
     * A controlled time override is permitted only
     * during local development testing.
     */
    const requestedTime =
      request.headers.get(
        "x-rootym-test-now",
      );
  
    if (
      !requestedTime
    ) {
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
      /*
       * This endpoint is intended for internal,
       * automated billing execution.
       *
       * It must not depend on a customer browser
       * authentication session.
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
  
      /*
       * The tenant is supplied through a trusted
       * server-side request header.
       */
      const tenantId =
        request.headers.get(
          "x-rootym-tenant-id",
        );
  
      if (!tenantId) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A valid tenant is required.",
          },
          {
            status: 400,
          },
        );
      }
  
      /*
       * Use the real server time normally.
       *
       * During development testing only, a controlled
       * execution time can be supplied so that we can
       * exercise an effective-date transition without
       * changing the database manually.
       */
      const executionTime =
        getExecutionTime(
          request,
        );
  
      /*
       * Apply the oldest confirmed plan change
       * whose effective date has been reached.
       */
      const result =
        await applyDuePlanChange({
          tenantId,
          now: executionTime,
        });
  
      /*
       * Nothing is currently due.
       *
       * This is a successful and idempotent result.
       */
      if (!result.applied) {
        return NextResponse.json(
          {
            success: true,
  
            message:
              result.reason ===
              "ALREADY_APPLIED"
                ? "The scheduled plan change has already been applied."
                : "No scheduled plan change is currently due.",
  
            data: {
              applied: false,
              reason:
                result.reason,
              executionTime,
            },
          },
          {
            status: 200,
          },
        );
      }
  
      /*
       * Return the resulting billing state.
       */
      return NextResponse.json(
        {
          success: true,
  
          message:
            "The scheduled billing plan change has been applied successfully.",
  
          data: {
            applied: true,
  
            executionTime,
  
            planChange: {
              id:
                result.planChange?.id,
  
              status:
                result.planChange?.status,
  
              effectiveAt:
                result.planChange?.effectiveAt,
  
              fromPlan:
                result.planChange?.fromPlan
                  ? {
                      id:
                        result.planChange
                          .fromPlan.id,
  
                      code:
                        result.planChange
                          .fromPlan.code,
  
                      name:
                        result.planChange
                          .fromPlan.name,
                    }
                  : null,
  
              toPlan:
                result.planChange?.toPlan
                  ? {
                      id:
                        result.planChange
                          .toPlan.id,
  
                      code:
                        result.planChange
                          .toPlan.code,
  
                      name:
                        result.planChange
                          .toPlan.name,
                    }
                  : null,
            },
  
            subscription:
              result.subscription
                ? {
                    id:
                      result.subscription.id,
  
                    status:
                      result.subscription
                        .status,
  
                    planId:
                      result.subscription
                        .planId,
  
                    billingInterval:
                      result.subscription
                        .billingInterval,
  
                    amount:
                      result.subscription
                        .amount,
  
                    currency:
                      result.subscription
                        .currency,
  
                    currentPeriodStart:
                      result.subscription
                        .currentPeriodStart,
  
                    currentPeriodEnd:
                      result.subscription
                        .currentPeriodEnd,
  
                    razorpaySubscriptionId:
                      result.subscription
                        .razorpaySubscriptionId,
                  }
                : null,
          },
        },
        {
          status: 200,
        },
      );
    } catch (error) {
      console.error(
        "POST /api/billing/plan-change/apply",
        error,
      );
  
      const message =
        error instanceof Error
          ? error.message
          : "Unable to apply the scheduled plan change.";
  
      return NextResponse.json(
        {
          success: false,
          message,
        },
        {
          status: 400,
        },
      );
    }
  }