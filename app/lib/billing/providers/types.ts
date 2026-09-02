/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Defines provider-independent billing contracts for
 *          checkout initialization, payment results, and
 *          subscription plan changes.
 * ============================================================
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
 * Normalized checkout initialization result.
 *
 * This represents the provider state BEFORE a customer
 * completes payment.
 *
 * A provider may create a subscription or checkout session
 * at this stage, but a payment ID may not exist yet.
 */
export interface BillingProviderCheckoutResult {
  provider: BillingProviderName;

  /**
   * Provider-side checkout/session identifier when available.
   */
  providerCheckoutId?: string | null;

  /**
   * Provider-side subscription identifier when the provider
   * creates a subscription before Checkout.
   */
  providerSubscriptionId?: string | null;

  /**
   * Public/client-side checkout key when required by the
   * provider's browser checkout flow.
   */
  checkoutKey?: string | null;

  /**
   * Optional provider checkout URL for providers that use
   * hosted checkout pages.
   */
  checkoutUrl?: string | null;

  amount: number;
  currency: string;
  status: BillingProviderPaymentStatus;
  metadata?: Record<string, unknown>;
}

/**
 * Normalized result returned by a billing provider after
 * an actual payment or payment reconciliation operation.
 *
 * Unlike BillingProviderCheckoutResult, providerPaymentId
 * is required here because this contract represents an
 * actual payment record.
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
 * checkout through a billing provider.
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
 * This operation initializes the provider checkout. It does
 * not assume that a payment has already been completed.
 */
export interface BillingSubscriptionProvider {
  createSubscriptionCheckout(
    input: BillingSubscriptionRequest,
  ): Promise<BillingProviderCheckoutResult>;
}

/**
 * Request used when processing a paid plan change.
 *
 * ROOTYM owns the business effective date and billing-period
 * calculation. Provider-specific subscription timing is not
 * supplied through this contract.
 */
export interface BillingPlanChangeRequest {
  tenantId: string;
  fromBillingInterval: BillingInterval;
  toBillingInterval: BillingInterval;
  amount: number;
  currency: string;

  /**
   * Provider-side target plan identifier.
   */
  razorpayPlanId: string;

  /**
   * Provider-side customer identifier.
   */
  razorpayCustomerId: string;

  /**
   * Number of billing cycles for the provider subscription.
   */
  totalCount: number;
}

/**
 * Provider contract for paid plan-change checkout.
 *
 * The provider may create a provider-side subscription or
 * checkout session, but payment completion happens separately.
 */
export interface BillingPlanChangeProvider {
  createPlanChangeCheckout(
    input: BillingPlanChangeRequest,
  ): Promise<BillingProviderCheckoutResult>;
}

/**
 * Combined billing-provider contract.
 *
 * A provider can implement subscription checkout,
 * plan-change checkout, or both capabilities.
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