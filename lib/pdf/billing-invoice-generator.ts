/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Maps persisted ROOTYM billing invoice records into
 *          the shared GST invoice PDF template and generates
 *          a PDF buffer for asynchronous storage or email.
 * ============================================================
 */

import { Buffer } from "node:buffer";

import {
  BillingInvoice,
  BillingInvoiceItem,
} from "@/lib/generated/prisma";

import {
  getActiveBillingTaxConfiguration,
} from "@/lib/services/billing/billing-tax-configuration.service";

import {
  BillingInvoicePdfData,
  BillingInvoicePdfItem,
  BillingInvoicePdfTaxType,
  BillingInvoiceTemplate,
} from "./billing-invoice-template";

type DecimalLike = {
  toNumber(): number;
};

type BillingInvoiceEntity =
  Omit<
    BillingInvoice,
    | "taxableAmount"
    | "taxRate"
    | "cgstRate"
    | "cgstAmount"
    | "sgstRate"
    | "sgstAmount"
    | "igstRate"
    | "igstAmount"
    | "totalTaxAmount"
    | "totalAmount"
  > & {
    taxableAmount: DecimalLike;
    taxRate: DecimalLike;
    cgstRate: DecimalLike;
    cgstAmount: DecimalLike;
    sgstRate: DecimalLike;
    sgstAmount: DecimalLike;
    igstRate: DecimalLike;
    igstAmount: DecimalLike;
    totalTaxAmount: DecimalLike;
    totalAmount: DecimalLike;
    items: BillingInvoiceItem[];
  };

function formatDate(
  value: Date,
): string {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  ).format(value);
}

function toNumber(
  value: DecimalLike,
): number {
  return value.toNumber();
}

function mapTaxType(
  value: BillingInvoiceEntity["taxType"],
): BillingInvoicePdfTaxType {
  switch (value) {
    case "CGST_SGST":
      return "CGST_SGST";
    case "IGST":
      return "IGST";
    case "NONE":
    default:
      return "NONE";
  }
}

function mapItem(
  item: BillingInvoiceItem,
): BillingInvoicePdfItem {
  return {
    description:
      item.description,
    quantity:
      Number(item.quantity),
    unit:
      item.unit,
    unitPrice:
      toNumber(
        item.unitPrice,
      ),
    taxableAmount:
      toNumber(
        item.taxableAmount,
      ),
  };
}

async function mapInvoice(
  invoice: BillingInvoiceEntity,
): Promise<BillingInvoicePdfData> {
  /*
   * Seller GST/legal identity is resolved from the tax configuration
   * effective on the invoice date. This avoids hardcoding ROOTYM seller
   * details and preserves the historical configuration selected for
   * that invoice date.
   */
  const sellerConfiguration =
    await getActiveBillingTaxConfiguration(
      invoice.invoiceDate,
    );

  if (!sellerConfiguration) {
    throw new Error(
      `No billing tax configuration found for invoice date ${invoice.invoiceDate.toISOString()}.`,
    );
  }

  return {
    invoiceNumber:
      invoice.invoiceNumber,
    invoiceDate:
      formatDate(
        invoice.invoiceDate,
      ),
    seller: {
      legalBusinessName:
        sellerConfiguration.legalName ??
        "ROOTYM AGRO HARVEST PRIVATE LIMITED",
      gstin:
        sellerConfiguration.gstin ??
        undefined,
        registeredAddress: [
          sellerConfiguration.registeredAddressLine1,
          sellerConfiguration.registeredAddressLine2,
        ]
          .filter(Boolean)
          .join(", ") || undefined,
      city:
        sellerConfiguration.registeredCity ??
        undefined,
      state:
        sellerConfiguration.registeredState ??
        undefined,
      postalCode:
        sellerConfiguration.registeredPostalCode ??
        undefined,
      country:
        sellerConfiguration.registeredCountry ??
        undefined,
    },
    customer: {
      name:
        invoice.customerName,
      email:
        invoice.customerEmail,
      mobile:
        invoice.customerMobile,
      addressLine1:
        invoice.billingAddressLine1,
      addressLine2:
        invoice.billingAddressLine2 ??
        undefined,
      city:
        invoice.billingCity ??
        "",
      state:
        invoice.billingState,
      postalCode:
        invoice.billingPostalCode ??
        "",
      country:
        invoice.billingCountry,
      gstin:
        invoice.customerGstin ??
        undefined,
    },
    paymentReference:
      invoice.providerPaymentId ??
      undefined,
    subscriptionReference:
      invoice.subscriptionId ??
      undefined,
    currency:
      invoice.currency,
    items:
      invoice.items.map(
        mapItem,
      ),
    taxableAmount:
      toNumber(
        invoice.taxableAmount,
      ),
    taxType:
      mapTaxType(
        invoice.taxType,
      ),
    taxRate:
      toNumber(
        invoice.taxRate,
      ),
    cgstRate:
      toNumber(
        invoice.cgstRate,
      ),
    cgstAmount:
      toNumber(
        invoice.cgstAmount,
      ),
    sgstRate:
      toNumber(
        invoice.sgstRate,
      ),
    sgstAmount:
      toNumber(
        invoice.sgstAmount,
      ),
    igstRate:
      toNumber(
        invoice.igstRate,
      ),
    igstAmount:
      toNumber(
        invoice.igstAmount,
      ),
    totalTaxAmount:
      toNumber(
        invoice.totalTaxAmount,
      ),
    totalAmount:
      toNumber(
        invoice.totalAmount,
      ),
  };
}

export class BillingInvoiceGenerator {
  private readonly template =
    new BillingInvoiceTemplate();

  async generateUint8Array(
    invoice: BillingInvoiceEntity,
  ): Promise<Uint8Array> {
    return this.template.render(
      await mapInvoice(invoice),
    );
  }

  async generateBuffer(
    invoice: BillingInvoiceEntity,
  ): Promise<Buffer> {
    const bytes =
      await this.generateUint8Array(
        invoice,
      );

    return Buffer.from(
      bytes,
    );
  }
}

export const billingInvoiceGenerator =
  new BillingInvoiceGenerator();

/**
 * Convenience function for API routes and other callers that need
 * the generated GST invoice PDF as a byte buffer.
 */
export async function generateBillingInvoicePdf(
  invoice: BillingInvoiceEntity,
): Promise<Buffer> {
  return billingInvoiceGenerator.generateBuffer(
    invoice,
  );
}
