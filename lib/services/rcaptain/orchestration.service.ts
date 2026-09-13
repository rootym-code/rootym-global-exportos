/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : R-CAPTAIN Intelligence
 * Component       : R-CAPTAIN Orchestration Service
 *
 * Description
 * ------------------------------------------------------------
 * Selects authoritative ROOTYM knowledge and controlled live
 * customer tools based on R-CAPTAIN context and detected intent.
 * Keeps database access application-side and sanitizes the final
 * orchestration context before it is passed to the AI provider.
 *
 * ============================================================
 * Author          : Prem Singh
 * Purpose         : Centralize R-CAPTAIN knowledge/live-state
 *                   orchestration so the chat API remains a
 *                   transport and conversation workflow layer.
 * ============================================================
 */

import type { RCaptainIntentType } from "@/lib/services/rcaptain/intent-detection.service";
import type { RCaptainContext } from "@/lib/services/rcaptain/context.service";

import { searchRCaptainKnowledge } from "@/lib/services/rcaptain/knowledge.service";
import { getRCaptainProductContext } from "@/lib/services/rcaptain/product-context.service";
import { sanitizeForAIJson } from "@/lib/services/rcaptain/privacy.service";

import { getCustomerAccountSummary } from "@/lib/services/rcaptain/tools/customer-account.tool";
import { getSubscriptionSummary } from "@/lib/services/rcaptain/tools/subscription.tool";
import { getWebsiteStatus } from "@/lib/services/rcaptain/tools/website-status.tool";
import { getProductsSummary } from "@/lib/services/rcaptain/tools/products-summary.tool";
import { getInquiriesSummary } from "@/lib/services/rcaptain/tools/inquiries-summary.tool";
import { getQuotesSummary } from "@/lib/services/rcaptain/tools/quotes-summary.tool";
import { getFollowUpsSummary } from "@/lib/services/rcaptain/tools/followups-summary.tool";
import { getRecentBuyerActivity } from "@/lib/services/rcaptain/tools/recent-buyer-activity.tool";

export interface RCaptainOrchestrationInput {
  message: string;
  intent: RCaptainIntentType;
  context: RCaptainContext;
}

export interface RCaptainOrchestrationResult {
  knowledgeContext: string;
  productContext: string;
  liveStateContext: string;
  executionContext: string;
}

function buildKnowledgeContext(message: string): string {
  const results = searchRCaptainKnowledge(message, { limit: 6 });

  if (results.length === 0) {
    return "No matching ROOTYM knowledge entry was found.";
  }

  return results
    .map(
      (entry) =>
        `[${entry.category}] ${entry.title} (v${entry.version})\n${entry.content}`
    )
    .join("\n\n");
}

async function getWorkspaceLiveState(intent: RCaptainIntentType) {
  switch (intent) {
    case "ACCOUNT_QUERY":
      return { account: await getCustomerAccountSummary() };

    case "SUBSCRIPTION_QUERY":
      return { subscription: await getSubscriptionSummary() };

    case "WEBSITE_STATUS_QUERY":
      return { websiteStatus: await getWebsiteStatus() };

    case "PRODUCTS_QUERY":
      return { products: await getProductsSummary() };

    case "INQUIRIES_QUERY":
      return { inquiries: await getInquiriesSummary() };

    case "QUOTES_QUERY":
      return { quotes: await getQuotesSummary() };

    case "FOLLOWUPS_QUERY":
      return { followUps: await getFollowUpsSummary() };

    case "BUYER_ACTIVITY_QUERY":
      return { recentBuyerActivity: await getRecentBuyerActivity() };

    default:
      return {};
  }
}

function shouldLoadProductContext(
  context: RCaptainContext,
  intent: RCaptainIntentType
): boolean {
  return (
    Boolean(context.website?.id) &&
    (intent === "PRODUCTS_QUERY" || intent === "BUYING_REQUEST")
  );
}

function buildExecutionContext(
  input: RCaptainOrchestrationInput,
  knowledgeContext: string,
  productContext: string,
  liveStateContext: string
): string {
  return sanitizeForAIJson(
    [
      `R-CAPTAIN MODE: ${input.context.mode}`,
      `WEBSITE: ${
        input.context.website
          ? input.context.website.name
          : "No Website context"
      }`,
      `TENANT: ${
        input.context.tenant
          ? input.context.tenant.name
          : "No authenticated tenant"
      }`,
      `AUTHENTICATED: ${
        input.context.permissions.authenticated ? "YES" : "NO"
      }`,
      `INTENT: ${input.intent}`,
      "",
      "MATCHING ROOTYM KNOWLEDGE:",
      knowledgeContext,
      "",
      "LIVE WEBSITE PRODUCT KNOWLEDGE:",
      productContext,
      "",
      "CONTROLLED WORKSPACE LIVE STATE:",
      liveStateContext,
    ].join("\n")
  );
}

export async function orchestrateRCaptain(
  input: RCaptainOrchestrationInput
): Promise<RCaptainOrchestrationResult> {
  const knowledgeContext = buildKnowledgeContext(input.message);

  let productContext =
    "No live Website product context was requested for this intent.";

  if (shouldLoadProductContext(input.context, input.intent)) {
    productContext = await getRCaptainProductContext(
      input.context.website!.id
    );
  }

  let liveStateContext =
    "No authenticated Workspace live state was requested for this intent.";

  if (input.context.mode === "WORKSPACE") {
    const liveState = await getWorkspaceLiveState(input.intent);

    liveStateContext = JSON.stringify(
      sanitizeForAIJson(liveState),
      null,
      2
    );
  }

  const executionContext = buildExecutionContext(
    input,
    knowledgeContext,
    productContext,
    liveStateContext
  );

  return {
    knowledgeContext,
    productContext,
    liveStateContext,
    executionContext,
  };
}
