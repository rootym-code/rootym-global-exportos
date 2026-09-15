/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Reconciles a failed Razorpay plan-change payment and
 *          prevents an unsuccessful checkout from remaining
 *          scheduled as a future ROOTYM plan change.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

import {
  PaymentStatus,
  PlanChangeStatus,
} from "@/lib/generated/prisma";

import { getCustomerSession } from "@/lib/auth/customer";

import { getRazorpayPayment } from "@/lib/services/billing/razorpay";

interface FailureRequestBody {
  planChangeId?: string;
  razorpayPaymentId?: string;
  razorpaySubscriptionId?: string;
}

interface RazorpayFailedPayment {
  id: string;
  status?: string;
  amount?: number;
  currency?: string;
  order_id?: string | null;
  invoice_id?: string | null;
  subscription_id?: string | null;
  error_code?: string | null;
  error_description?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCustomerSession(request);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer authentication is required.",
        },
        { status: 401 },
      );
    }

    let body: FailureRequestBody;

    try {
      body = (await request.json()) as FailureRequestBody;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "A valid JSON request body is required.",
        },
        { status: 400 },
      );
    }

    const planChangeId = body.planChangeId?.trim();
    const razorpayPaymentId = body.razorpayPaymentId?.trim();
    const razorpaySubscriptionId =
      body.razorpaySubscriptionId?.trim();

    if (!planChangeId || !razorpayPaymentId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The failed plan-change payment details are incomplete.",
        },
        { status: 400 },
      );
    }

    const planChange =
      await prisma.subscriptionPlanChange.findFirst({
        where: {
          id: planChangeId,
          tenantId: session.tenant.id,
        },
        include: {
          subscription: true,
          toPlan: true,
        },
      });

    if (!planChange) {
      return NextResponse.json(
        {
          success: false,
          message: "The plan change could not be found.",
        },
        { status: 404 },
      );
    }

    if (
      planChange.status ===
      PlanChangeStatus.PAYMENT_CONFIRMED ||
      planChange.status ===
      PlanChangeStatus.APPLIED
    ) {
      return NextResponse.json(
        {
          success: true,
          message:
            "The plan change has already been successfully paid and confirmed.",
          data: {
            planChangeId: planChange.id,
            status: planChange.status,
          },
        },
        { status: 200 },
      );
    }

    if (
      planChange.status !==
      PlanChangeStatus.PAYMENT_PENDING
    ) {
      return NextResponse.json(
        {
          success: true,
          message:
            "The plan change is no longer awaiting payment.",
          data: {
            planChangeId: planChange.id,
            status: planChange.status,
          },
        },
        { status: 200 },
      );
    }

    const razorpayPayment =
      (await getRazorpayPayment(
        razorpayPaymentId,
      )) as RazorpayFailedPayment;

    if (
      !razorpayPayment ||
      razorpayPayment.id !== razorpayPaymentId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The Razorpay payment could not be verified.",
        },
        { status: 400 },
      );
    }

    if (razorpayPayment.status !== "failed") {
      return NextResponse.json(
        {
          success: false,
          message:
            `Razorpay has not confirmed this payment as failed. Current payment status: ${
              razorpayPayment.status ?? "unknown"
            }.`,
        },
        { status: 409 },
      );
    }

    if (
      razorpayPayment.subscription_id &&
      razorpayPayment.subscription_id !==
        planChange.razorpaySubscriptionId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The Razorpay payment does not belong to this plan change.",
        },
        { status: 403 },
      );
    }

    if (
      razorpaySubscriptionId &&
      planChange.razorpaySubscriptionId &&
      razorpaySubscriptionId !==
        planChange.razorpaySubscriptionId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The Razorpay subscription does not belong to this plan change.",
        },
        { status: 403 },
      );
    }

    await prisma.$transaction(async (tx) => {
      const existingPayment =
        await tx.payment.findUnique({
          where: {
            providerPaymentId: razorpayPaymentId,
          },
        });

      if (
        existingPayment &&
        existingPayment.tenantId !== session.tenant.id
      ) {
        throw new Error(
          "Payment does not belong to this workspace.",
        );
      }

      if (existingPayment) {
        await tx.payment.update({
          where: {
            id: existingPayment.id,
          },
          data: {
            subscriptionId:
              planChange.subscriptionId,
            planChangeId: planChange.id,
            provider: "RAZORPAY",
            providerSubscriptionId:
              planChange.razorpaySubscriptionId ??
              razorpayPayment.subscription_id ??
              null,
            providerOrderId:
              razorpayPayment.order_id ??
              existingPayment.providerOrderId ??
              null,
            providerInvoiceId:
              razorpayPayment.invoice_id ??
              existingPayment.providerInvoiceId ??
              null,
            amount:
              razorpayPayment.amount ??
              existingPayment.amount ??
              planChange.toPlan.amount,
            currency:
              razorpayPayment.currency ??
              existingPayment.currency ??
              planChange.toPlan.currency,
            status: PaymentStatus.FAILED,
            paidAt: null,
            failureCode:
              razorpayPayment.error_code ?? null,
            failureReason:
              razorpayPayment.error_description ?? null,
          },
        });
      } else {
        await tx.payment.create({
          data: {
            tenantId: session.tenant.id,
            subscriptionId: planChange.subscriptionId,
            planChangeId: planChange.id,
            provider: "RAZORPAY",
            providerPaymentId: razorpayPaymentId,
            providerOrderId:
              razorpayPayment.order_id ?? null,
            providerInvoiceId:
              razorpayPayment.invoice_id ?? null,
            providerSubscriptionId:
              planChange.razorpaySubscriptionId ??
              razorpayPayment.subscription_id ??
              null,
            amount:
              razorpayPayment.amount ??
              planChange.toPlan.amount,
            currency:
              razorpayPayment.currency ??
              planChange.toPlan.currency,
            status: PaymentStatus.FAILED,
            paidAt: null,
            failureCode:
              razorpayPayment.error_code ?? null,
            failureReason:
              razorpayPayment.error_description ?? null,
          },
        });
      }

      await tx.subscriptionPlanChange.update({
        where: {
          id: planChange.id,
        },
        data: {
          status: PlanChangeStatus.PAYMENT_FAILED,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Razorpay payment failed. The Annual plan has not been scheduled.",
        data: {
          planChangeId: planChange.id,
          status: PlanChangeStatus.PAYMENT_FAILED,
          paymentStatus: PaymentStatus.FAILED,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "POST /api/billing/plan-change/failure",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to reconcile the failed plan-change payment.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
