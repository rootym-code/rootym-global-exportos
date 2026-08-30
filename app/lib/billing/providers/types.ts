/**
 * Author: Prem Singh
 * Purpose: Defines the provider-independent contract used by ROOTYM billing operations.
 */

import type { BillingInterval } from "@/lib/generated/prisma";

export type BillingProviderName =
  | "TEST"
  | "RAZORPAY";

export type BillingProviderPaymentStatus =
  | "CREATED"
  | "AUTHORIZED"
  | "CAPTURED"
  | "FAILED"
  | "UNKNOWN";

export interface BillingProviderPaymentResult {
  provider: BillingProviderName;

  providerPaymentId: string;

  providerSubscriptionId?: string | null;

  amount: number;

  currency: string;

  status: BillingProviderPaymentStatus;

  paidAt?: Date | null;

  failureCode?: string | null;

  failureReason?: string | null;

  metadata?: Record<
    string,
    unknown
  >;
}

export interface BillingPlanChangeRequest {
  tenantId: string;

  fromBillingInterval: BillingInterval;

  toBillingInterval: BillingInterval;

  amount: number;

  currency: string;
}

export interface BillingPlanChangeProvider {
  createPlanChangePayment(
    input: BillingPlanChangeRequest,
  ): Promise<BillingProviderPaymentResult>;
}