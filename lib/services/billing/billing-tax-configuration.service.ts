/**
 * Author: Prem Singh
 * Purpose: Provides server-side persistence and validation for ROOTYM Admin GST and invoice tax configuration.
 */

import prisma from "@/lib/prisma";

export interface BillingTaxConfigurationInput {
  name: string;
  effectiveFrom: Date;
  effectiveTo?: Date | null;
  gstEnabled: boolean;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  legalName?: string | null;
  gstin?: string | null;
  registeredAddressLine1?: string | null;
  registeredAddressLine2?: string | null;
  registeredCity?: string | null;
  registeredState: string;
  registeredPostalCode?: string | null;
  registeredCountry: string;
  invoicePrefix: string;
  isActive: boolean;
}

function validateRate(value: number, fieldName: string) {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error(`${fieldName} must be between 0 and 100.`);
  }
}

function normalizeOptional(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeInput(
  input: BillingTaxConfigurationInput
): BillingTaxConfigurationInput {
  const name = input.name.trim();
  const registeredState = input.registeredState.trim();
  const registeredCountry = input.registeredCountry.trim();
  const invoicePrefix = input.invoicePrefix.trim().toUpperCase();

  if (!name) {
    throw new Error("Tax configuration name is required.");
  }

  if (!registeredState) {
    throw new Error("ROOTYM registered state is required.");
  }

  if (!registeredCountry) {
    throw new Error("ROOTYM registered country is required.");
  }

  if (!invoicePrefix) {
    throw new Error("Invoice prefix is required.");
  }

  validateRate(input.cgstRate, "CGST rate");
  validateRate(input.sgstRate, "SGST rate");
  validateRate(input.igstRate, "IGST rate");

  if (input.effectiveTo && input.effectiveTo <= input.effectiveFrom) {
    throw new Error("Effective-to date must be later than effective-from date.");
  }

  return {
    ...input,
    name,
    registeredState,
    registeredCountry,
    invoicePrefix,
    legalName: normalizeOptional(input.legalName),
    gstin: normalizeOptional(input.gstin)?.toUpperCase() ?? null,
    registeredAddressLine1: normalizeOptional(input.registeredAddressLine1),
    registeredAddressLine2: normalizeOptional(input.registeredAddressLine2),
    registeredCity: normalizeOptional(input.registeredCity),
    registeredPostalCode: normalizeOptional(input.registeredPostalCode),
  };
}

/**
 * Returns the currently active tax configuration for ROOTYM invoicing.
 *
 * The effective-date window is evaluated server-side so a future configuration
 * can be created without mutating historical invoice configuration.
 */
export async function getActiveBillingTaxConfiguration(
  at: Date = new Date()
) {
  return prisma.billingTaxConfiguration.findFirst({
    where: {
      isActive: true,
      effectiveFrom: {
        lte: at,
      },
      OR: [
        {
          effectiveTo: null,
        },
        {
          effectiveTo: {
            gt: at,
          },
        },
      ],
    },
    orderBy: [
      {
        effectiveFrom: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

/**
 * Returns all tax configurations ordered newest-effective first.
 *
 * This is intended for the Admin configuration screen and audit/history views.
 */
export async function listBillingTaxConfigurations() {
  return prisma.billingTaxConfiguration.findMany({
    orderBy: [
      {
        effectiveFrom: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

/**
 * Creates a new Admin tax configuration.
 *
 * A new configuration becomes the active configuration immediately only when
 * isActive=true and its effective date is current or earlier. Existing
 * configurations are retained for historical auditability.
 */
export async function createBillingTaxConfiguration(
  input: BillingTaxConfigurationInput
) {
  const normalized = normalizeInput(input);
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    if (normalized.isActive && normalized.effectiveFrom <= now) {
      await tx.billingTaxConfiguration.updateMany({
        where: {
          isActive: true,
        },
        data: {
          isActive: false,
          effectiveTo: normalized.effectiveFrom,
        },
      });
    }

    return tx.billingTaxConfiguration.create({
      data: {
        name: normalized.name,
        effectiveFrom: normalized.effectiveFrom,
        effectiveTo: normalized.effectiveTo ?? null,
        gstEnabled: normalized.gstEnabled,
        cgstRate: normalized.cgstRate,
        sgstRate: normalized.sgstRate,
        igstRate: normalized.igstRate,
        legalName: normalized.legalName ?? null,
        gstin: normalized.gstin ?? null,
        registeredAddressLine1:
          normalized.registeredAddressLine1 ?? null,
        registeredAddressLine2:
          normalized.registeredAddressLine2 ?? null,
        registeredCity: normalized.registeredCity ?? null,
        registeredState: normalized.registeredState,
        registeredPostalCode:
          normalized.registeredPostalCode ?? null,
        registeredCountry: normalized.registeredCountry,
        invoicePrefix: normalized.invoicePrefix,
        isActive: normalized.isActive,
      },
    });
  });
}

/**
 * Disables a tax configuration without deleting it.
 *
 * Historical configuration is retained because issued invoices must remain
 * traceable to the tax settings that were used at the time.
 */
export async function deactivateBillingTaxConfiguration(
  id: string
) {
  if (!id) {
    throw new Error("Tax configuration ID is required.");
  }

  return prisma.billingTaxConfiguration.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });
}
