/**
 * ============================================================
 * ROOTYM Brain
 * File: lib/brain/inquiry/DuplicateDetector.ts
 *
 * Duplicate Inquiry Detection
 * ============================================================
 */

import { DUPLICATE_RULES } from "./rules";

export interface DuplicateCandidate {
  id: string;
  companyName?: string | null;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface DuplicateInput {
  companyName?: string | null;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;

  candidates: DuplicateCandidate[];
}

export interface DuplicateMatch {
  inquiryId: string;
  score: number;
  matchedFields: string[];
}

export interface DuplicateResult {
  isDuplicate: boolean;
  highestScore: number;
  matches: DuplicateMatch[];
}

export class DuplicateDetector {
  detect(input: DuplicateInput): DuplicateResult {
    const matches: DuplicateMatch[] = [];

    for (const candidate of input.candidates) {
      let score = 0;
      const matchedFields: string[] = [];

      if (
        this.equals(input.email, candidate.email)
      ) {
        score += DUPLICATE_RULES.emailWeight;
        matchedFields.push("email");
      }

      if (
        this.equals(input.phone, candidate.phone)
      ) {
        score += DUPLICATE_RULES.phoneWeight;
        matchedFields.push("phone");
      }

      if (
        this.equals(
          input.companyName,
          candidate.companyName,
        )
      ) {
        score += DUPLICATE_RULES.companyWeight;
        matchedFields.push("companyName");
      }

      if (
        this.equals(
          input.contactPerson,
          candidate.contactPerson,
        )
      ) {
        score += DUPLICATE_RULES.contactPersonWeight;
        matchedFields.push("contactPerson");
      }

      if (score > 0) {
        matches.push({
          inquiryId: candidate.id,
          score,
          matchedFields,
        });
      }
    }

    matches.sort((a, b) => b.score - a.score);

    const highestScore =
      matches.length > 0 ? matches[0].score : 0;

    return {
      isDuplicate:
        highestScore >=
        DUPLICATE_RULES.duplicateThreshold,
      highestScore,
      matches,
    };
  }

  private equals(
    a?: string | null,
    b?: string | null,
  ): boolean {
    if (!a || !b) {
      return false;
    }

    return (
      a.trim().toLowerCase() ===
      b.trim().toLowerCase()
    );
  }
}

export const duplicateDetector =
  new DuplicateDetector();

export default duplicateDetector;