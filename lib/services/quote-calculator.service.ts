/**
 * ============================================================
 * ROOTYM Quote Calculator Service
 * File: lib/services/quote-calculator.service.ts
 * Sprint 8
 * ============================================================
 */

import { Prisma } from "@/lib/generated/prisma";

export interface QuoteCalculationItem {
  quantity: number;
  unitPrice: number;
}

export interface QuoteCalculationInput {
  items: QuoteCalculationItem[];

  discount?: number;
  freight?: number;
  insurance?: number;
  tax?: number;
}

export interface CalculatedQuoteItem
  extends QuoteCalculationItem {
  lineTotal: number;
}

export interface QuoteCalculationResult {
  items: CalculatedQuoteItem[];

  subtotal: number;

  discount: number;
  freight: number;
  insurance: number;
  tax: number;

  grandTotal: number;
}

const round = (value: number): number =>
  Number(value.toFixed(2));

export function calculateLineTotal(
  quantity: number,
  unitPrice: number
): number {
  return round(quantity * unitPrice);
}

export function calculateSubtotal(
  items: QuoteCalculationItem[]
): number {
  return round(
    items.reduce(
      (sum, item) =>
        sum + calculateLineTotal(item.quantity, item.unitPrice),
      0
    )
  );
}

export function calculateGrandTotal(
  subtotal: number,
  discount = 0,
  freight = 0,
  insurance = 0,
  tax = 0
): number {
  return round(
    subtotal -
      discount +
      freight +
      insurance +
      tax
  );
}

export function calculateQuote(
  input: QuoteCalculationInput
): QuoteCalculationResult {
  const items: CalculatedQuoteItem[] = input.items.map(
    (item) => ({
      ...item,
      lineTotal: calculateLineTotal(
        item.quantity,
        item.unitPrice
      ),
    })
  );

  const subtotal = calculateSubtotal(items);

  const discount = round(input.discount ?? 0);
  const freight = round(input.freight ?? 0);
  const insurance = round(input.insurance ?? 0);
  const tax = round(input.tax ?? 0);

  const grandTotal = calculateGrandTotal(
    subtotal,
    discount,
    freight,
    insurance,
    tax
  );

  return {
    items,
    subtotal,
    discount,
    freight,
    insurance,
    tax,
    grandTotal,
  };
}

export function validateQuoteTotals(
  result: QuoteCalculationResult
): boolean {
  const subtotal = calculateSubtotal(result.items);

  const grandTotal = calculateGrandTotal(
    subtotal,
    result.discount,
    result.freight,
    result.insurance,
    result.tax
  );

  return (
    subtotal === result.subtotal &&
    grandTotal === result.grandTotal
  );
}

export function toDecimal(
  value: number
): Prisma.Decimal {
  return new Prisma.Decimal(round(value));
}

export function decimalTotals(
  result: QuoteCalculationResult
) {
  return {
    subtotal: toDecimal(result.subtotal),
    discount: toDecimal(result.discount),
    freight: toDecimal(result.freight),
    insurance: toDecimal(result.insurance),
    tax: toDecimal(result.tax),
    grandTotal: toDecimal(result.grandTotal),
  };
}