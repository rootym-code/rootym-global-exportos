/**
 * Author: Prem Singh
 * Purpose: Validates and persists tenant billing details used for ROOTYM SaaS payment and invoice processing.
 */

import { prisma } from "@/lib/prisma";

export interface BillingCustomerDetailsInput {
  customerName: string;
  mobile: string;
  email: string;
  billingAddressLine1: string;
  billingAddressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  gstRegistered: boolean;
  gstin?: string | null;
}

export interface BillingCustomerDetailsResult {
  id: string;
  tenantId: string;
  customerName: string;
  mobile: string;
  email: string;
  billingAddressLine1: string;
  billingAddressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  gstRegistered: boolean;
  gstin: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function normalizeRequired(value: unknown, fieldName: string): string {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} is required.`);
  }

  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalized;
}

function normalizeOptional(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error("Optional billing detail fields must be text values.");
  }

  const normalized = value.trim();

  return normalized || null;
}

function validateEmail(email: string): string {
  const normalized = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw new Error("A valid billing email address is required.");
  }

  return normalized;
}

function validateMobile(mobile: string): string {
  const normalized = mobile.trim();
  const digits = normalized.replace(/\D/g, "");

  if (digits.length < 8 || digits.length > 15) {
    throw new Error("A valid billing mobile number is required.");
  }

  return normalized;
}

function validateGstin(
  gstRegistered: boolean,
  gstin: string | null
): string | null {
  if (!gstRegistered) {
    return null;
  }

  if (!gstin) {
    throw new Error(
      "GSTIN is required when the customer is GST registered."
    );
  }

  const normalized = gstin.trim().toUpperCase();

  if (!/^[0-9A-Z]{15}$/.test(normalized)) {
    throw new Error("A valid 15-character GSTIN is required.");
  }

  return normalized;
}

function normalizeInput(input: BillingCustomerDetailsInput) {
  const customerName = normalizeRequired(
    input.customerName,
    "Customer/business name"
  );

  const mobile = validateMobile(
    normalizeRequired(input.mobile, "Mobile number")
  );

  const email = validateEmail(
    normalizeRequired(input.email, "Email address")
  );

  const billingAddressLine1 = normalizeRequired(
    input.billingAddressLine1,
    "Billing address"
  );

  const state = normalizeRequired(input.state, "Billing state");

  const city = normalizeRequired(input.city, "Billing city");

  const postalCode = normalizeRequired(
    input.postalCode,
    "Billing postal code"
  );

  const country = normalizeRequired(input.country, "Billing country");

  if (
    input.gstRegistered !== true &&
    input.gstRegistered !== false
  ) {
    throw new Error("GST registration status is required.");
  }

  const gstRegistered = input.gstRegistered;

  const gstin = validateGstin(
    gstRegistered,
    normalizeOptional(input.gstin)
  );

  return {
    customerName,
    mobile,
    email,
    addressLine1: billingAddressLine1,
    addressLine2: normalizeOptional(input.billingAddressLine2),
    city,
    state,
    postalCode,
    country,
    gstRegistered,
    gstin,
  };
}

function mapBillingCustomerDetails(
  value: Awaited<
    ReturnType<typeof prisma.billingCustomerDetails.findUnique>
  >
): BillingCustomerDetailsResult | null {
  if (!value) {
    return null;
  }

  return {
    id: value.id,
    tenantId: value.tenantId,
    customerName: value.customerName,
    mobile: value.mobile,
    email: value.email,
    billingAddressLine1: value.addressLine1,
    billingAddressLine2: value.addressLine2,
    city: value.city,
    state: value.state,
    postalCode: value.postalCode,
    country: value.country,
    gstRegistered: value.gstRegistered,
    gstin: value.gstin,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

export async function getBillingCustomerDetails(
  tenantId: string
): Promise<BillingCustomerDetailsResult | null> {
  const normalizedTenantId = normalizeRequired(tenantId, "Tenant ID");

  const details = await prisma.billingCustomerDetails.findUnique({
    where: {
      tenantId: normalizedTenantId,
    },
  });

  return mapBillingCustomerDetails(details);
}

export async function saveBillingCustomerDetails(
  tenantId: string,
  input: BillingCustomerDetailsInput
): Promise<BillingCustomerDetailsResult> {
  const normalizedTenantId = normalizeRequired(tenantId, "Tenant ID");
  const data = normalizeInput(input);

  const details = await prisma.billingCustomerDetails.upsert({
    where: {
      tenantId: normalizedTenantId,
    },
    create: {
      tenantId: normalizedTenantId,
      ...data,
    },
    update: data,
  });

  const result = mapBillingCustomerDetails(details);

  if (!result) {
    throw new Error("Unable to save billing customer details.");
  }

  return result;
}
