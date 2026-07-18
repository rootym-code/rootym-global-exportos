/**
 * ============================================================
 * ROOTYM Brain
 * File: lib/brain/inquiry/ScoringEngine.ts
 *
 * Central Inquiry Scoring Engine
 *
 * Single source of truth for all inquiry scoring.
 * ============================================================
 */

import {
  COUNTRY_PRIORITY_RULES,
  GENERIC_EMAIL_DOMAINS,
  INQUIRY_SCORE,
  LARGE_QUANTITY_THRESHOLD,
} from "./rules";

export interface ScoringInput {
  country?: string | null;
  companyName?: string | null;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  product?: string | null;
  quantity?: string | null;
  unit?: string | null;
  message?: string | null;
  isRepeatBuyer?: boolean;
}

export interface ScoreBreakdown {
  country: number;
  company: number;
  contactPerson: number;
  email: number;
  phone: number;
  product: number;
  quantity: number;
  message: number;
  repeatBuyer: number;
}

export interface ScoringResult {
  totalScore: number;
  breakdown: ScoreBreakdown;
  reasons: string[];
}

export class ScoringEngine {
  calculate(input: ScoringInput): ScoringResult {
    const breakdown: ScoreBreakdown = {
      country: 0,
      company: 0,
      contactPerson: 0,
      email: 0,
      phone: 0,
      product: 0,
      quantity: 0,
      message: 0,
      repeatBuyer: 0,
    };

    const reasons: string[] = [];

    /* ------------------------------------------------------ */
    /* Country                                                 */
    /* ------------------------------------------------------ */

    const country = input.country?.trim().toLowerCase();

    if (country) {
      const rule = COUNTRY_PRIORITY_RULES.find((r) =>
        r.countries.some(
          (value) => value.toLowerCase() === country,
        ),
      );

      if (rule) {
        breakdown.country = rule.score;
        reasons.push(`Target market (${rule.countries[0]})`);
      }
    }

    /* ------------------------------------------------------ */
    /* Company                                                 */
    /* ------------------------------------------------------ */

    if (input.companyName?.trim()) {
      breakdown.company = INQUIRY_SCORE.companyProvided;
      reasons.push("Company provided");
    }

    /* ------------------------------------------------------ */
    /* Contact Person                                          */
    /* ------------------------------------------------------ */

    if (input.contactPerson?.trim()) {
      breakdown.contactPerson =
        INQUIRY_SCORE.contactPersonProvided;

      reasons.push("Contact person provided");
    }

    /* ------------------------------------------------------ */
    /* Email                                                   */
    /* ------------------------------------------------------ */

    if (input.email?.trim()) {
      const domain =
        input.email.split("@")[1]?.toLowerCase() ?? "";

      breakdown.email = GENERIC_EMAIL_DOMAINS.includes(
        domain as (typeof GENERIC_EMAIL_DOMAINS)[number],
      )
        ? INQUIRY_SCORE.genericEmail
        : INQUIRY_SCORE.businessEmail;

      reasons.push(
        breakdown.email === INQUIRY_SCORE.businessEmail
          ? "Business email"
          : "Generic email",
      );
    }

    /* ------------------------------------------------------ */
    /* Phone                                                   */
    /* ------------------------------------------------------ */

    if (input.phone?.trim()) {
      breakdown.phone = INQUIRY_SCORE.phoneProvided;
      reasons.push("Phone provided");
    }

    /* ------------------------------------------------------ */
    /* Product                                                 */
    /* ------------------------------------------------------ */

    if (input.product?.trim()) {
      breakdown.product = INQUIRY_SCORE.productProvided;
      reasons.push("Product specified");
    }

    /* ------------------------------------------------------ */
    /* Quantity                                                */
    /* ------------------------------------------------------ */

    const quantity =
      input.quantity != null && input.quantity !== ""
        ? Number(input.quantity)
        : undefined;

    if (
      quantity !== undefined &&
      Number.isFinite(quantity) &&
      quantity > 0
    ) {
      breakdown.quantity +=
        INQUIRY_SCORE.quantityProvided;

      reasons.push("Quantity provided");

      if (quantity >= LARGE_QUANTITY_THRESHOLD) {
        breakdown.quantity +=
          INQUIRY_SCORE.largeQuantity;

        reasons.push("Large quantity");
      }
    }

    /* ------------------------------------------------------ */
    /* Message                                                 */
    /* ------------------------------------------------------ */

    if (input.message?.trim()) {
      breakdown.message = INQUIRY_SCORE.messageProvided;
      reasons.push("Message included");
    }

    /* ------------------------------------------------------ */
    /* Repeat Buyer                                            */
    /* ------------------------------------------------------ */

    if (input.isRepeatBuyer) {
      breakdown.repeatBuyer =
        INQUIRY_SCORE.repeatBuyer;

      reasons.push("Repeat buyer");
    }

    const totalScore = Math.min(
      100,
      Object.values(breakdown).reduce(
        (sum, value) => sum + value,
        0,
      ),
    );

    return {
      totalScore,
      breakdown,
      reasons,
    };
  }
}

export const scoringEngine = new ScoringEngine();

export default scoringEngine;