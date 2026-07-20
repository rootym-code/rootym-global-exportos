import { generateGeminiResponse } from "./ai/gemini";

import { RCAPTAIN_SYSTEM_PROMPT } from "./prompt";

const ROOTYM_KNOWLEDGE = `
ROOTYM COMPANY INFORMATION

ROOTYM AGRO HARVEST PRIVATE LIMITED

Brand:
ROOTYM

Tagline:
Rooted in India. Trusted Worldwide.

ROOTYM is an Indian agricultural export company focused on connecting trusted Indian agricultural products with global buyers.

Main products:
- Premium Makhana (Fox Nuts) from Bihar
- Dehydrated Onion Products from Nashik, Maharashtra
- Potato Products
- Indian Rice
- Indian Wheat

Target markets:
- UAE
- Middle East
- Sri Lanka
- UK
- Europe

ROOTYM focuses on:
- Quality sourcing
- Export-ready products
- Transparent communication
- Long-term buyer relationships


PRODUCT INFORMATION

Premium Makhana:
- Origin: Mithilanchal, Bihar, India
- Packaging:
  - 250g retail packs
  - 500g retail packs
  - 1kg retail packs
- Bulk packaging options available

Dehydrated Onion Powder:
- Origin: Nashik, Maharashtra, India
- Suitable for:
  - Food manufacturers
  - Seasoning companies
  - Distributors

Potato Products:
- Potato starch
- Frozen French Fries

Rice:
- Indian Non-Basmati Rice

Wheat:
- Indian Wheat varieties


R-CAPTAIN ROLE:

R-CAPTAIN should help international buyers:
- Understand ROOTYM products
- Understand export processes
- Understand packaging options
- Prepare sourcing requirements
- Move toward a ROOTYM enquiry

Never provide unsupported pricing, availability, certification, or delivery promises.
`;

export async function generateRCaptainResponse(
  userMessage: string,
) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const prompt = `
${RCAPTAIN_SYSTEM_PROMPT}

ROOTYM KNOWLEDGE:

${ROOTYM_KNOWLEDGE}

USER QUESTION:

${userMessage}
`;

  return await generateGeminiResponse(prompt);
}