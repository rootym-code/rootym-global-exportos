/**
 * ============================================================
 * ROOTYM PDF Proforma Invoice Generator
 * File: lib/pdf/proforma-invoice-generator.ts
 * Sprint 8.1
 * ============================================================
 */

import { Buffer } from "node:buffer";

import {
  ProformaInvoicePdfData,
  ProformaInvoiceTemplate,
} from "./proforma-invoice-template";

type DecimalLike = {
  toNumber(): number;
};

export interface ProformaInvoiceEntity {
  piNumber: string;
  issueDate: Date;
  paymentDueDate?: Date | null;

  quoteNumber?: string | null;

  buyerName: string;
  buyerCompany?: string | null;
  buyerAddress?: string | null;
  buyerCountry?: string | null;

  currency: string;

  subtotal: DecimalLike;
  discount: DecimalLike;
  freight: DecimalLike;
  insurance: DecimalLike;
  tax: DecimalLike;
  grandTotal: DecimalLike;

  notes?: string | null;

  items: Array<{
    description: string;
    quantity: number;
    unit: string;
    unitPrice: DecimalLike;
    lineTotal: DecimalLike;
  }>;
}

function fmtDate(
  date: Date
): string {
  return new Intl.DateTimeFormat(
    "en-GB"
  ).format(date);
}

function mapItems(
  items: ProformaInvoiceEntity["items"]
): ProformaInvoicePdfData["items"] {
  return items.map(
    (item) => ({
      description:
        item.description,

      quantity:
        Number(item.quantity),

      unit:
        item.unit,

      unitPrice:
        item.unitPrice.toNumber(),

      lineTotal:
        item.lineTotal.toNumber(),
    })
  );
}

function mapProformaInvoice(
  pi: ProformaInvoiceEntity
): ProformaInvoicePdfData {
  return {
    piNumber:
      pi.piNumber,

    issueDate:
      fmtDate(pi.issueDate),

    paymentDueDate:
      pi.paymentDueDate
        ? fmtDate(
            pi.paymentDueDate
          )
        : undefined,

    quoteNumber:
      pi.quoteNumber ??
      undefined,

    buyerName:
      pi.buyerName,

    buyerCompany:
      pi.buyerCompany ??
      "",

    buyerAddress:
      pi.buyerAddress ??
      "",

    buyerCountry:
      pi.buyerCountry ??
      "",

    currency:
      pi.currency,

    items:
      mapItems(pi.items),

    subtotal:
      pi.subtotal.toNumber(),

    discount:
      pi.discount.toNumber(),

    freight:
      pi.freight.toNumber(),

    insurance:
      pi.insurance.toNumber(),

    tax:
      pi.tax.toNumber(),

    grandTotal:
      pi.grandTotal.toNumber(),

    notes:
      pi.notes ?? "",
  };
}

export class ProformaInvoiceGenerator {
  private readonly template =
    new ProformaInvoiceTemplate();

  async generateUint8Array(
    pi: ProformaInvoiceEntity
  ): Promise<Uint8Array> {
    return this.template.render(
      mapProformaInvoice(pi)
    );
  }

  async generateBuffer(
    pi: ProformaInvoiceEntity
  ): Promise<Buffer> {
    const bytes =
      await this.generateUint8Array(
        pi
      );

    return Buffer.from(bytes);
  }

  async generateBase64(
    pi: ProformaInvoiceEntity
  ): Promise<string> {
    const buffer =
      await this.generateBuffer(
        pi
      );

    return buffer.toString(
      "base64"
    );
  }
}

export const proformaInvoiceGenerator =
  new ProformaInvoiceGenerator();