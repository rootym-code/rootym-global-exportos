/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the central billing-provider registry and
 *          resolves providers configured for the active billing
 *          environment.
 * ============================================================
 */

import prisma from "@/lib/prisma";

import type {
  BillingProviderName,
  BillingProviderPaymentResult,
  BillingProviderCheckoutResult,
  BillingPlanChangeRequest,
  BillingSubscriptionRequest,
} from "./types";

import { testBillingProvider } from "./test.provider";
import { razorpayBillingProvider } from "./razorpay.provider";

import { getBillingEnvironment } from "../environment";

/**
 * ============================================================
 * Registry-facing provider definition
 * ============================================================
 *
 * This interface describes the capabilities that the billing
 * registry can expose to the rest of the application.
 *
 * Provider availability is still controlled separately by
 * BillingProviderConfig.
 * ============================================================
 */
export interface BillingProvider {
  name: BillingProviderName;

  displayName: string;

  createSubscriptionCheckout?: (
    input: BillingSubscriptionRequest,
  ) => Promise<BillingProviderCheckoutResult>;

  createPlanChangeCheckout?: (
    input: BillingPlanChangeRequest,
  ) => Promise<BillingProviderCheckoutResult>;
}

/**
 * ============================================================
 * Provider registry
 * ============================================================
 *
 * This is the application-level provider registry.
 *
 * Adding a provider here makes the provider available to the
 * billing system.
 *
 * Whether customers can actually use the provider is controlled
 * separately through BillingProviderConfig.
 *
 * Example future providers:
 *
 *   STRIPE
 *   PAYPAL
 *   ADYEN
 *   etc.
 * ============================================================
 */
const BILLING_PROVIDER_REGISTRY: Record<
  BillingProviderName,
  BillingProvider
> = {
  TEST: {
    name: "TEST",

    displayName: "Test Payment",

    createSubscriptionCheckout:
      testBillingProvider.createSubscriptionCheckout,

    createPlanChangeCheckout:
      testBillingProvider.createPlanChangeCheckout,
  },

  RAZORPAY: {
    name: "RAZORPAY",

    displayName: "Razorpay",

    createSubscriptionCheckout:
      razorpayBillingProvider.createSubscriptionCheckout,

    createPlanChangeCheckout:
      razorpayBillingProvider.createPlanChangeCheckout,
  },
};

/**
 * ============================================================
 * Return the complete application provider registry.
 * ============================================================
 *
 * This does not check database configuration.
 */
export function getBillingProviderRegistry(): BillingProvider[] {
  return Object.values(BILLING_PROVIDER_REGISTRY);
}

/**
 * ============================================================
 * Resolve one provider from the application registry.
 * ============================================================
 */
export function getBillingProviderDefinition(
  providerName: BillingProviderName,
): BillingProvider {
  const provider =
    BILLING_PROVIDER_REGISTRY[providerName];

  if (!provider) {
    throw new Error(
      `Unsupported billing provider: ${providerName}`,
    );
  }

  return provider;
}

/**
 * ============================================================
 * Environment-aware configured providers
 * ============================================================
 *
 * The database controls which registered providers are enabled
 * for the current billing environment.
 *
 * Therefore:
 *
 *   Application Registry
 *       ↓
 *   Provider exists
 *
 *   BillingProviderConfig
 *       ↓
 *   Provider enabled for environment
 * ============================================================
 */
export async function getConfiguredBillingProviders() {
  const environment =
    getBillingEnvironment();

  const configurations =
    await prisma.billingProviderConfig.findMany({
      where: {
        environment,
        enabled: true,
      },

      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          provider: "asc",
        },
      ],
    });

  return configurations
    .map((configuration) => {
      const providerName =
        configuration.provider as BillingProviderName;

      const definition =
        BILLING_PROVIDER_REGISTRY[providerName];

      if (!definition) {
        return null;
      }

      return {
        name: definition.name,

        displayName:
          configuration.displayName ??
          definition.displayName,

        sortOrder:
          configuration.sortOrder,

        environment,

        createSubscriptionCheckout:
          definition.createSubscriptionCheckout,

        createPlanChangeCheckout:
          definition.createPlanChangeCheckout,
      };
    })
    .filter(
      (
        provider,
      ): provider is NonNullable<typeof provider> =>
        provider !== null,
    );
}

/**
 * ============================================================
 * Resolve one configured provider
 * ============================================================
 *
 * This performs both checks:
 *
 *   1. Provider exists in the application registry.
 *   2. Provider is enabled for the current environment.
 *
 * This is the backend enforcement boundary that prevents a
 * customer request from bypassing administrator configuration.
 * ============================================================
 */
export async function getConfiguredBillingProvider(
  providerName: BillingProviderName,
) {
  const environment =
    getBillingEnvironment();

  const definition =
    BILLING_PROVIDER_REGISTRY[providerName];

  if (!definition) {
    throw new Error(
      `Unsupported billing provider: ${providerName}`,
    );
  }

  const configuration =
    await prisma.billingProviderConfig.findUnique({
      where: {
        environment_provider: {
          environment,

          provider:
            providerName,
        },
      },
    });

  if (!configuration) {
    throw new Error(
      `Billing provider ${providerName} is not configured for ${environment}.`,
    );
  }

  if (!configuration.enabled) {
    throw new Error(
      `Billing provider ${providerName} is disabled for ${environment}.`,
    );
  }

  return {
    name: definition.name,

    displayName:
      configuration.displayName ??
      definition.displayName,

    sortOrder:
      configuration.sortOrder,

    environment,

    createSubscriptionCheckout:
      definition.createSubscriptionCheckout,

    createPlanChangeCheckout:
      definition.createPlanChangeCheckout,
  };
}