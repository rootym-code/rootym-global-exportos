/**
 * ============================================================
 * ROOTYM
 * File: lib/utils/quote-calculator.ts
 * Sprint 8.1
 * ============================================================
 */

type CalculationItem = {
  quantity: number;
  unitPrice: number;
};

export interface QuoteCalculationInput {
  items: CalculationItem[];

  freight?: number;

  insurance?: number;

  discount?: number;

  tax?: number;
}

export interface QuoteCalculationResult {
  subtotal: number;

  discount: number;

  taxableAmount: number;

  tax: number;

  freight: number;

  insurance: number;

  grandTotal: number;
}

const round = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

/**
 * ------------------------------------------------------------
 * Calculate a single line total
 * ------------------------------------------------------------
 */
export function calculateLineTotal(
  quantity: number,
  unitPrice: number
): number {
  return round(quantity * unitPrice);
}

/**
 * ------------------------------------------------------------
 * Calculate Quote Totals
 * ------------------------------------------------------------
 */
export function calculateQuoteTotals(
  input: QuoteCalculationInput
): QuoteCalculationResult {
  const freight = input.freight ?? 0;

  const insurance = input.insurance ?? 0;

  const discount = input.discount ?? 0;

  const tax = input.tax ?? 0;

  const subtotal = round(
    input.items.reduce(
      (sum, item) => sum + calculateLineTotal(item.quantity, item.unitPrice),
      0
    )
  );

  const taxableAmount = round(
    Math.max(0, subtotal - discount)
  );

  const grandTotal = round(
    taxableAmount +
      tax +
      freight +
      insurance
  );

  return {
    subtotal,
    discount: round(discount),
    taxableAmount,
    tax: round(tax),
    freight: round(freight),
    insurance: round(insurance),
    grandTotal,
  };
}