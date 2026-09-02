/**
 * Author: Prem Singh
 * Purpose: Defines the provider-independent contracts used by ROOTYM billing
 *          operations, including subscription checkout and plan changes.
 */

import type { BillingInterval } from "@/lib/generated/prisma";

/**
 * Supported billing provider identifiers.
 *
 * New providers can be added here without changing the
 * billing business logic.
 */
export type BillingProviderName =
  | "TEST"
  | "RAZORPAY";

/**
 * Normalized payment status returned by billing providers.
 */
export type BillingProviderPaymentStatus =
  | "CREATED"
  | "AUTHORIZED"
  | "CAPTURED"
  | "FAILED"
  | "UNKNOWN";

/**
 * Normalized result returned by a billing provider
 * after a payment or checkout operation.
 */
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

  metadata?: Record<string, unknown>;
}

/**
 * Request used when creating an initial paid subscription
 * payment through a billing provider.
 */
export interface BillingSubscriptionRequest {
  tenantId: string;

  planId: string;

  billingInterval: BillingInterval;

  amount: number;

  currency: string;
}

/**
 * Provider contract for initial subscription checkout.
 *
 * Every billing provider must expose the same normalized
 * interface to the ROOTYM billing service.
 */
export interface BillingSubscriptionProvider {
  createSubscriptionPayment(
    input: BillingSubscriptionRequest,
  ): Promise<BillingProviderPaymentResult>;
}

/**
 * Request used when processing a paid plan change.
 */
export interface BillingPlanChangeRequest {
  tenantId: string;

  fromBillingInterval: BillingInterval;

  toBillingInterval: BillingInterval;

  amount: number;

  currency: string;
}

/**
 * Provider contract for paid plan-change payments.
 */
export interface BillingPlanChangeProvider {
  createPlanChangePayment(
    input: BillingPlanChangeRequest,
  ): Promise<BillingProviderPaymentResult>;
}

/**
 * Combined billing-provider contract.
 *
 * A provider can implement subscription checkout,
 * plan changes, or both capabilities.
 *
 * This allows the provider registry to determine which
 * operations are supported without coupling billing
 * business logic to a specific provider.
 */
export interface BillingProvider
  extends Partial<
    BillingSubscriptionProvider &
      BillingPlanChangeProvider
  > {
  readonly name: BillingProviderName;
}