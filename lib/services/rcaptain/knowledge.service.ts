/**
 * Author: Prem Singh
 * Purpose: Provide the controlled, versioned ROOTYM knowledge layer for R-CAPTAIN.
 *
 * This service is intentionally application-owned. It does not query customer
 * records and it does not send customer PII to an AI provider.
 */

export type RCaptainKnowledgeCategory =
  | "PLATFORM"
  | "WORKFLOW"
  | "WEBSITE"
  | "PRODUCTS"
  | "SALES"
  | "PLANS"
  | "BILLING"
  | "TROUBLESHOOTING"
  | "PRIVACY"
  | "POLICY"
  | "FAQ";

export interface RCaptainKnowledgeEntry {
  id: string;
  version: string;
  category: RCaptainKnowledgeCategory;
  title: string;
  content: string;
  keywords: string[];
  active: boolean;
}

export interface RCaptainKnowledgeSearchResult {
  id: string;
  version: string;
  category: RCaptainKnowledgeCategory;
  title: string;
  content: string;
  score: number;
}

/**
 * Stable platform knowledge.
 *
 * Keep operational rules here rather than embedding them in provider prompts.
 * Customer-specific/live state belongs to controlled R-CAPTAIN tools.
 */
const KNOWLEDGE: RCaptainKnowledgeEntry[] = [
  {
    id: "platform-overview",
    version: "1.0.0",
    category: "PLATFORM",
    title: "ROOTYM Global ExportOS",
    content:
      "ROOTYM Global ExportOS is a platform for managing export business workflows, including products, buyers and inquiries, quotations, follow-ups, proforma invoices, and customer Website operations.",
    keywords: [
      "rootym",
      "exportos",
      "platform",
      "export",
      "export business",
    ],
    active: true,
  },
  {
    id: "workflow-inquiry-to-proforma",
    version: "1.0.0",
    category: "WORKFLOW",
    title: "Inquiry to Proforma Invoice",
    content:
      "The standard sales workflow is Inquiry → understand and qualify the buyer requirement → prepare Quote → follow up → buyer acceptance or order confirmation → Proforma Invoice. R-CAPTAIN should identify missing commercial information before recommending or executing quote or proforma generation.",
    keywords: [
      "inquiry",
      "quote",
      "quotation",
      "followup",
      "follow-up",
      "proforma",
      "invoice",
      "sales workflow",
      "commercial",
    ],
    active: true,
  },
  {
    id: "sales-requirement-information",
    version: "1.0.0",
    category: "SALES",
    title: "Required Sales Requirement Information",
    content:
      "Before a quotation is prepared, R-CAPTAIN should help establish the buyer requirement, including product, quantity, unit, packaging where applicable, destination, Incoterm, currency, price basis, and relevant commercial terms. It should not invent missing values.",
    keywords: [
      "quantity",
      "unit",
      "packaging",
      "destination",
      "incoterm",
      "currency",
      "price",
      "commercial terms",
      "requirement",
    ],
    active: true,
  },
  {
    id: "website-readiness",
    version: "1.0.0",
    category: "WEBSITE",
    title: "Customer Website Readiness",
    content:
      "A customer Website should have its configuration, required pages, products, and relevant branding configured before being considered ready to go live. R-CAPTAIN should use the live Website Status tool for customer-specific readiness instead of assuming that configuration is complete.",
    keywords: [
      "website",
      "website setup",
      "website readiness",
      "go live",
      "live",
      "configuration",
      "branding",
      "pages",
    ],
    active: true,
  },
  {
    id: "product-catalogue",
    version: "1.0.0",
    category: "PRODUCTS",
    title: "Customer Product Catalogue",
    content:
      "Customer product information and current pricing must come from the customer's Website-scoped live product data. R-CAPTAIN must not invent products, specifications, availability, or pricing.",
    keywords: [
      "product",
      "products",
      "catalogue",
      "catalog",
      "pricing",
      "price",
      "specification",
      "availability",
    ],
    active: true,
  },
  {
    id: "plans-and-trial",
    version: "1.0.0",
    category: "PLANS",
    title: "Plans and Trial Information",
    content:
      "Plan, subscription, trial, expiry, billing interval, and pending plan-change information must be obtained from controlled live account and subscription tools when answering customer-specific questions. R-CAPTAIN must not guess a customer's current plan or trial status.",
    keywords: [
      "plan",
      "plans",
      "subscription",
      "trial",
      "free trial",
      "expiry",
      "upgrade",
      "downgrade",
    ],
    active: true,
  },
  {
    id: "privacy-boundary",
    version: "1.0.0",
    category: "PRIVACY",
    title: "R-CAPTAIN Privacy Boundary",
    content:
      "Customer bank account information, mobile numbers, email addresses, financial credentials, passwords, tokens, API keys, and other sensitive personal or financial information must not be sent to the AI provider. R-CAPTAIN should use application-side allowlists and masking where a customer explicitly needs to see configured contact information. It must not reveal or infer secrets or financial credentials.",
    keywords: [
      "privacy",
      "pii",
      "personal information",
      "email",
      "mobile",
      "phone",
      "bank",
      "account",
      "password",
      "secret",
      "token",
      "api key",
      "financial",
    ],
    active: true,
  },
  {
    id: "no-invention-rule",
    version: "1.0.0",
    category: "POLICY",
    title: "No Invention Rule",
    content:
      "R-CAPTAIN must distinguish known live application state from general platform knowledge. It must not invent customer data, buyer data, product data, pricing, subscription status, Website configuration, quotation values, or workflow completion status.",
    keywords: [
      "invent",
      "guess",
      "unknown",
      "missing information",
      "accuracy",
      "live data",
    ],
    active: true,
  },
  {
    id: "customer-state",
    version: "1.0.0",
    category: "POLICY",
    title: "Customer State Boundary",
    content:
      "Customer-specific answers should be based on controlled application tools scoped to the authenticated customer's tenant and Website. Knowledge entries provide stable rules and explanations; they do not replace live customer state.",
    keywords: [
      "customer state",
      "tenant",
      "website scope",
      "workspace",
      "account",
      "live state",
    ],
    active: true,
  },
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreEntry(entry: RCaptainKnowledgeEntry, normalizedQuery: string): number {
  if (!normalizedQuery) {
    return 0;
  }

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const title = normalize(entry.title);
  const content = normalize(entry.content);
  const keywords = entry.keywords.map(normalize);

  let score = 0;

  if (title.includes(normalizedQuery)) {
    score += 10;
  }

  if (content.includes(normalizedQuery)) {
    score += 5;
  }

  for (const token of queryTokens) {
    if (keywords.some((keyword) => keyword === token)) {
      score += 4;
    } else if (keywords.some((keyword) => keyword.includes(token))) {
      score += 2;
    }

    if (title.includes(token)) {
      score += 2;
    }

    if (content.includes(token)) {
      score += 1;
    }
  }

  return score;
}

/**
 * Search the controlled knowledge layer.
 *
 * This is intentionally a deterministic first-stage retrieval mechanism.
 * A future persistent knowledge repository can replace the static entries
 * without changing the public search contract.
 */
export function searchRCaptainKnowledge(
  query: string,
  options?: {
    category?: RCaptainKnowledgeCategory;
    limit?: number;
  }
): RCaptainKnowledgeSearchResult[] {
  const normalizedQuery = normalize(query);
  const limit = Math.min(Math.max(options?.limit ?? 5, 1), 20);

  if (!normalizedQuery) {
    return [];
  }

  return KNOWLEDGE.filter(
    (entry) =>
      entry.active &&
      (!options?.category || entry.category === options.category)
  )
    .map((entry) => ({
      entry,
      score: scoreEntry(entry, normalizedQuery),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry, score }) => ({
      id: entry.id,
      version: entry.version,
      category: entry.category,
      title: entry.title,
      content: entry.content,
      score,
    }));
}

/**
 * Retrieve a single active knowledge entry by stable ID.
 */
export function getRCaptainKnowledgeEntry(
  id: string
): RCaptainKnowledgeEntry | null {
  return KNOWLEDGE.find((entry) => entry.active && entry.id === id) ?? null;
}

/**
 * Return the currently active knowledge version.
 */
export function getRCaptainKnowledgeVersion(): string {
  return "1.0.0";
}
