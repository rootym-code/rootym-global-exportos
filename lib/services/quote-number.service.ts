/**
 * ============================================================
 * ROOTYM Quote Number Service
 * Sprint 8
 * ============================================================
 */

import { Prisma } from "@/lib/generated/prisma";

const PREFIX = "QT";

export async function generateQuoteNumber(
  tx: Prisma.TransactionClient
): Promise<string> {
  const year = new Date().getFullYear();

  const latestQuote = await tx.quote.findFirst({
    where: {
      quoteNumber: {
        startsWith: `${PREFIX}-${year}-`,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      quoteNumber: true,
    },
  });

  let sequence = 1;

  if (latestQuote) {
    const parts = latestQuote.quoteNumber.split("-");
    const lastSequence = Number(parts[2]);

    if (!Number.isNaN(lastSequence)) {
      sequence = lastSequence + 1;
    }
  }

  return `${PREFIX}-${year}-${sequence
    .toString()
    .padStart(5, "0")}`;
}

export function validateQuoteNumber(
  quoteNumber: string
): boolean {
  return /^QT-\d{4}-\d{5}$/.test(quoteNumber);
}

export function parseQuoteNumber(
  quoteNumber: string
) {
  if (!validateQuoteNumber(quoteNumber)) {
    throw new Error("Invalid quote number.");
  }

  const [, year, sequence] = quoteNumber.split("-");

  return {
    prefix: PREFIX,
    year: Number(year),
    sequence: Number(sequence),
  };
}