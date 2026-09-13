/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : R-CAPTAIN Intelligence
 * Component       : Intent Detection Service
 *
 * Description
 * ------------------------------------------------------------
 * Detects R-CAPTAIN conversation intent without querying the
 * database or embedding a customer/product catalogue.
 *
 * ============================================================
 * Author          : Prem Singh
 * Purpose         : Classify operational R-CAPTAIN intents so
 *                   the orchestration layer can route requests
 *                   to the appropriate controlled knowledge or
 *                   live-state tool.
 * ============================================================
 */

export type RCaptainIntentType =
  | "GENERAL_QUERY"
  | "BUYING_REQUEST"
  | "ACCOUNT_QUERY"
  | "SUBSCRIPTION_QUERY"
  | "WEBSITE_STATUS_QUERY"
  | "PRODUCTS_QUERY"
  | "INQUIRIES_QUERY"
  | "QUOTES_QUERY"
  | "FOLLOWUPS_QUERY"
  | "BUYER_ACTIVITY_QUERY"
  | "WORKFLOW_QUERY";

export type RCaptainIntent = {
  intent: RCaptainIntentType;
  product?: string;
  quantity?: string;
  country?: string;
};

type IntentRule = {
  intent: RCaptainIntentType;
  keywords: string[];
};

/**
 * Operational intent rules are deliberately generic.
 *
 * Product names are not stored here. Customer-specific products
 * must come from the Website-scoped product context service.
 */
const INTENT_RULES: IntentRule[] = [
  {
    intent: "ACCOUNT_QUERY",
    keywords: [
      "my account",
      "account details",
      "account status",
      "business details",
      "company details",
      "my business",
      "workspace account",
    ],
  },
  {
    intent: "SUBSCRIPTION_QUERY",
    keywords: [
      "my plan",
      "current plan",
      "subscription",
      "subscription status",
      "trial",
      "free trial",
      "trial status",
      "plan expiry",
      "subscription expiry",
      "billing plan",
      "upgrade plan",
      "downgrade plan",
    ],
  },
  {
    intent: "WEBSITE_STATUS_QUERY",
    keywords: [
      "website status",
      "website ready",
      "website readiness",
      "website live",
      "go live",
      "publish website",
      "website configuration",
      "website setup",
      "website pages",
      "website branding",
      "is my website",
    ],
  },
  {
    intent: "PRODUCTS_QUERY",
    keywords: [
      "my products",
      "my product",
      "product catalogue",
      "product catalog",
      "products catalogue",
      "published products",
      "product pricing",
      "product prices",
      "product availability",
      "product count",
      "how many products",
    ],
  },
  {
    intent: "INQUIRIES_QUERY",
    keywords: [
      "my inquiries",
      "my enquiries",
      "inquiry status",
      "inquiry statuses",
      "inquiries",
      "enquiries",
      "how many inquiries",
      "how many enquiries",
      "new inquiries",
      "recent inquiries",
      "pending inquiries",
    ],
  },
  {
    intent: "QUOTES_QUERY",
    keywords: [
      "my quotes",
      "my quotations",
      "quote status",
      "quotation status",
      "quotes",
      "quotations",
      "how many quotes",
      "pending quotes",
      "accepted quotes",
      "draft quotes",
    ],
  },
  {
    intent: "FOLLOWUPS_QUERY",
    keywords: [
      "my follow ups",
      "my follow-ups",
      "follow up status",
      "follow-up status",
      "followups",
      "follow-ups",
      "overdue follow ups",
      "overdue follow-ups",
      "due today",
      "follow up today",
      "follow-up today",
      "pending follow ups",
      "pending follow-ups",
    ],
  },
  {
    intent: "BUYER_ACTIVITY_QUERY",
    keywords: [
      "buyer activity",
      "recent buyer activity",
      "recent buyers",
      "buyer inquiries",
      "buyer enquiries",
      "what happened with buyers",
      "recent customer activity",
      "recent inquiry activity",
      "recent enquiry activity",
    ],
  },
  {
    intent: "WORKFLOW_QUERY",
    keywords: [
      "how does the workflow work",
      "sales workflow",
      "inquiry to quote",
      "inquiry to quotation",
      "quote to proforma",
      "quotation to proforma",
      "how to create a quote",
      "how to create a quotation",
      "how to create proforma",
      "proforma invoice workflow",
      "sales process",
      "export workflow",
      "what information do i need",
      "what information is required",
    ],
  },
];

const BUYING_KEYWORDS = [
  "buy",
  "buying",
  "need",
  "require",
  "requirement",
  "looking for",
  "want",
  "purchase",
  "order",
  "quotation",
  "quote",
  "price",
  "pricing",
  "tons",
  "ton",
  "kg",
  "kgs",
  "metric ton",
  "metric tons",
  "mt",
];

function containsKeyword(
  text: string,
  keyword: string
): boolean {
  return text.includes(keyword);
}

function matchesRule(
  text: string,
  rule: IntentRule
): boolean {
  return rule.keywords.some(
    (keyword) =>
      containsKeyword(text, keyword)
  );
}

function extractProduct(
  message: string
): string | undefined {
  /**
   * Product extraction is intentionally conservative.
   *
   * This function no longer maintains a hardcoded ROOTYM
   * product catalogue. Live product matching is handled by
   * the Website-scoped product context layer.
   *
   * The return value is therefore undefined here and exists
   * only for backwards compatibility with the existing intent
   * contract.
   */
  void message;
  return undefined;
}

function extractQuantity(
  message: string
): string | undefined {
  const match =
    message.match(
      /\d+(?:[.,]\d+)?\s?(kg|kgs|ton|tons|mt|metric tons)/i
    );

  return match
    ? match[0]
    : undefined;
}

function extractCountry(
  message: string
): string | undefined {
  /**
   * Country extraction remains a lightweight conversational
   * hint. It is not used as an authoritative customer or buyer
   * record and does not expose PII to the AI provider.
   */
  const countries = [
    "uae",
    "united arab emirates",
    "dubai",
    "saudi",
    "saudi arabia",
    "uk",
    "united kingdom",
    "usa",
    "united states",
    "singapore",
    "sri lanka",
    "germany",
    "france",
    "italy",
    "netherlands",
    "canada",
    "australia",
  ];

  return countries.find(
    (country) =>
      message
        .toLowerCase()
        .includes(country)
  );
}

export function detectRCaptainIntent(
  message: string
): RCaptainIntent {
  const text =
    message
      .trim()
      .toLowerCase();

  if (!text) {
    return {
      intent: "GENERAL_QUERY",
    };
  }

  /**
   * Buying requests take precedence because words such as
   * "quote", "price", and "order" can also appear in workflow
   * questions.
   *
   * Explicit workflow phrasing is checked first when it clearly
   * describes how a process works rather than an actual purchase.
   */
  const workflowMatch =
    INTENT_RULES.find(
      (rule) =>
        rule.intent === "WORKFLOW_QUERY" &&
        matchesRule(text, rule)
    );

  const buyingMatch =
    BUYING_KEYWORDS.some(
      (keyword) =>
        containsKeyword(text, keyword)
    );

  const hasPurchaseContext =
    Boolean(
      text.includes("i want") ||
      text.includes("i need") ||
      text.includes("we need") ||
      text.includes("we want") ||
      text.includes("looking for") ||
      text.includes("place an order") ||
      text.includes("would like to buy")
    );

  if (
    buyingMatch &&
    (
      hasPurchaseContext ||
      /\d+(?:[.,]\d+)?\s?(kg|kgs|ton|tons|mt|metric tons)/i.test(
        text
      )
    )
  ) {
    return {
      intent: "BUYING_REQUEST",
      product:
        extractProduct(message),
      quantity:
        extractQuantity(message),
      country:
        extractCountry(message),
    };
  }

  if (workflowMatch) {
    return {
      intent: "WORKFLOW_QUERY",
    };
  }

  /**
   * Check operational read-only intents after the buying
   * and workflow checks.
   */
  for (const rule of INTENT_RULES) {
    if (
      rule.intent === "WORKFLOW_QUERY"
    ) {
      continue;
    }

    if (matchesRule(text, rule)) {
      return {
        intent: rule.intent,
      };
    }
  }

  return {
    intent: "GENERAL_QUERY",
  };
}
