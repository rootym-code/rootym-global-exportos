/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : R-CAPTAIN Intelligence
 * Component       : R-CAPTAIN Engine
 *
 * Description
 * ------------------------------------------------------------
 * Orchestrates the legacy R-CAPTAIN response path using the
 * shared AI provider and live Website-scoped product context.
 *
 * Product catalogue data is never hardcoded in this engine.
 *
 * ============================================================
 * Author          : Prem Singh
 * Purpose         : Keep stable ROOTYM role guidance in the
 *                   engine while retrieving product knowledge
 *                   dynamically from the database.
 * ============================================================
 */

import { prisma } from "@/lib/prisma";
import { generateGeminiResponse } from "./ai/gemini";
import { RCAPTAIN_SYSTEM_PROMPT } from "./prompt";
import {
  getRCaptainProductContext,
} from "@/lib/services/rcaptain/product-context.service";

const ROOTYM_KNOWLEDGE = `
ROOTYM COMPANY INFORMATION

ROOTYM AGRO HARVEST PRIVATE LIMITED

Brand:
ROOTYM

Tagline:
Rooted in India. Trusted Worldwide.

ROOTYM is an Indian agricultural export company focused on
connecting trusted Indian agricultural products with global buyers.

ROOTYM focuses on:
- Quality sourcing
- Export-ready products
- Transparent communication
- Long-term buyer relationships

R-CAPTAIN ROLE:

R-CAPTAIN should help users:
- Understand ROOTYM and its platform
- Understand products using the live product context supplied by the database
- Understand export processes
- Prepare sourcing requirements
- Move toward a qualified ROOTYM enquiry when appropriate

Never provide unsupported pricing, availability, certification,
or delivery promises.
`;

type RCaptainResponseOptions = {
  websiteSlug?: string;
};

export async function generateRCaptainResponse(
  userMessage: string,
  options: RCaptainResponseOptions = {},
) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  let websiteContext = `
No Website product catalogue is available for this request.

Do not invent or assume product information.
`;

  if (options.websiteSlug) {
    const website =
      await prisma.website.findUnique({
        where: {
          slug: options.websiteSlug,
        },
        select: {
          id: true,
          isActive: true,
        },
      });

    if (!website || !website.isActive) {
      throw new Error(
        "R-CAPTAIN Website context could not be resolved."
      );
    }

    websiteContext =
      await getRCaptainProductContext(
        website.id
      );
  }

  const prompt = `
${RCAPTAIN_SYSTEM_PROMPT}

ROOTYM PLATFORM KNOWLEDGE:

${ROOTYM_KNOWLEDGE}

LIVE WEBSITE PRODUCT KNOWLEDGE:

${websiteContext}

USER QUESTION:

${userMessage}
`;

  return await generateGeminiResponse(prompt);
}
