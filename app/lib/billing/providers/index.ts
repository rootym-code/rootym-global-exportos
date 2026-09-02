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
  BillingPlanChangeRequest,
} from "./types";

import { testBillingProvider } from "./test.provider";

import { getBillingEnvironment } from "../environment";

export interface BillingProvider {
  name: BillingProviderName;
  displayName: string;
  createPlanChangePayment?: (
    input: BillingPlanChangeRequest,
  ) => Promise<BillingProviderPaymentResult>;
}

/**
 * ============================================================
 * Provider registry
 * ============================================================
 *
 * This is the application-level provider registry.
 *
 * Adding a new provider here makes the provider available to
 * the billing system. Whether customers can actually use it is
 * controlled separately through BillingProviderConfig.
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
    createPlanChangePayment:
      testBillingProvider.createPlanChangePayment,
  },

  RAZORPAY: {
    name: "RAZORPAY",
    displayName: "Razorpay",
  },
};

/**
 * Return the complete application provider registry.
 *
 * This does not check database configuration.
 */
export function getBillingProviderRegistry(): BillingProvider[] {
  return Object.values(BILLING_PROVIDER_REGISTRY);
}

/**
 * Resolve one provider from the application registry.
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
 *   Registry
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
        BILLING_PROVIDER_REGISTRY[
          providerName
        ];

      if (!definition) {
        return null;
      }

      return {
        name: definition.name,
        displayName:
          configuration.displayName?.trim() ||
          definition.displayName,
        sortOrder:
          configuration.sortOrder,
        environment,
        createPlanChangePayment:
          definition.createPlanChangePayment,
      };
    })
    .filter(
      (
        provider,
      ): provider is NonNullable<
        typeof provider
      > => provider !== null,
    );
}

/**
 * ============================================================
 * Resolve a configured provider
 * ============================================================
 *
 * This function should be used by billing operations when a
 * specific provider is requested.
 *
 * It verifies BOTH:
 *
 *   1. Provider exists in the application registry.
 *   2. Provider is enabled for the current environment.
 * ============================================================
 */
export async function getConfiguredBillingProvider(
  providerName: BillingProviderName,
) {
  const environment =
    getBillingEnvironment();

  const configuration =
    await prisma.billingProviderConfig.findUnique({
      where: {
        environment_provider: {
          environment,
          provider: providerName,
        },
      },
    });

  if (!configuration?.enabled) {
    throw new Error(
      `Billing provider "${providerName}" is not enabled for the ${environment.toLowerCase()} environment.`,
    );
  }

  const definition =
    getBillingProviderDefinition(
      providerName,
    );

  return {
    name: definition.name,
    displayName:
      configuration.displayName?.trim() ||
      definition.displayName,
    sortOrder:
      configuration.sortOrder,
    environment,
    createPlanChangePayment:
      definition.createPlanChangePayment,
  };
}