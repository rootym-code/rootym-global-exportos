/**
 * ============================================================
 * ROOTYM
 * File: lib/utils/quote-number.ts
 * Sprint 8.1
 * ============================================================
 */

const PREFIX = "RTM-QT";

function pad(value: number, length = 5): string {
  return value.toString().padStart(length, "0");
}

/**
 * Example:
 * RTM-QT-2026-00001
 */
export function generateQuoteNumber(
  sequence: number,
  date: Date = new Date()
): string {
  const year = date.getFullYear();

  return `${PREFIX}-${year}-${pad(sequence)}`;
}

/**
 * Extracts numeric sequence.
 *
 * RTM-QT-2026-00015
 * =>
 * 15
 */
export function extractQuoteSequence(
  quoteNumber: string
): number | null {
  const match = quoteNumber.match(
    /^RTM-QT-(\d{4})-(\d+)$/
  );

  if (!match) {
    return null;
  }

  return Number(match[2]);
}

/**
 * Basic format validation.
 */
export function isValidQuoteNumber(
  quoteNumber: string
): boolean {
  return /^RTM-QT-\d{4}-\d{5}$/.test(
    quoteNumber
  );
}

/**
 * Compare quote numbers.
 *
 * Returns:
 * -1 => a < b
 *  0 => equal
 *  1 => a > b
 */
export function compareQuoteNumbers(
  a: string,
  b: string
): number {
  const seqA = extractQuoteSequence(a);
  const seqB = extractQuoteSequence(b);

  if (seqA === null && seqB === null) {
    return 0;
  }

  if (seqA === null) {
    return -1;
  }

  if (seqB === null) {
    return 1;
  }

  return Math.sign(seqA - seqB);
}

/**
 * Human-friendly display.
 *
 * RTM-QT-2026-00027
 * =>
 * Quote #27 (2026)
 */
export function formatQuoteLabel(
  quoteNumber: string
): string {
  const match = quoteNumber.match(
    /^RTM-QT-(\d{4})-(\d{5})$/
  );

  if (!match) {
    return quoteNumber;
  }

  const year = match[1];
  const sequence = Number(match[2]);

  return `Quote #${sequence} (${year})`;
}