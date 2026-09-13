/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : R-CAPTAIN Intelligence
 * Component       : R-CAPTAIN Chat API
 *
 * Description
 * ------------------------------------------------------------
 * Orchestrates R-CAPTAIN conversation, context resolution,
 * knowledge retrieval, controlled live customer state,
 * lead qualification, inquiry creation, execution context,
 * and privacy-safe AI interaction.
 *
 * Context modes:
 * • MARKETING  - anonymous ROOTYM/platform guidance
 * • BUYER      - public tenant Website assistant
 * • WORKSPACE  - authenticated customer assistant
 *
 * ============================================================
 * Author          : Prem Singh
 * Purpose         : Orchestrate R-CAPTAIN using authoritative
 *                   context, controlled knowledge/live-state
 *                   tools, and an application-side privacy
 *                   boundary before AI provider access.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { AIService } from "@/lib/ai/AIService";

import {
  ConversationStateService,
  ConversationLeadState,
} from "@/lib/services/rcaptain/conversation-state.service";

import {
  InquiryCreationService,
} from "@/lib/services/rcaptain/inquiry-creation.service";

import {
  LeadQualificationService,
} from "@/lib/services/rcaptain/lead-qualification.service";

import {
  LeadExtractionService,
} from "@/lib/services/rcaptain/lead-extraction.service";

import {
  detectRCaptainIntent,
} from "@/lib/services/rcaptain/intent-detection.service";

import {
  resolveRCaptainContext,
  RCaptainMode,
} from "@/lib/services/rcaptain/context.service";

import {
  orchestrateRCaptain,
} from "@/lib/services/rcaptain/orchestration.service";

import type { AIMessage } from "@/lib/ai/types";

function resolveRequestedMode(
  value: unknown,
  websiteSlug: string | null
): RCaptainMode {
  /**
   * Explicit mode is preferred.
   *
   * For backwards compatibility with the existing public
   * Website widget, a valid Website slug without an explicit
   * mode is treated as BUYER context.
   *
   * Without Website context, the legacy endpoint remains
   * available as MARKETING context.
   */
  if (
    typeof value === "string" &&
    (
      value === "MARKETING" ||
      value === "BUYER" ||
      value === "WORKSPACE"
    )
  ) {
    return value;
  }

  return websiteSlug
    ? "BUYER"
    : "MARKETING";
}

export async function POST(
  request: NextRequest
) {
  let executionStage = "request-start";

  try {
    executionStage = "validate-gemini-key";

    const apiKey =
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Gemini API key is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    executionStage = "parse-request-body";

    const body =
      await request.json();

    const message =
      body.message;

    if (
      !message ||
      typeof message !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Message is required.",
        },
        {
          status: 400,
        }
      );
    }

    const messages: AIMessage[] =
      Array.isArray(body.messages)
        ? body.messages
        : [];

    const websiteSlug =
      typeof body.websiteSlug === "string" &&
      body.websiteSlug.trim()
        ? body.websiteSlug.trim()
        : null;

    const mode =
      resolveRequestedMode(
        body.mode,
        websiteSlug
      );

    /**
     * Resolve the authoritative R-CAPTAIN context.
     *
     * Workspace mode uses the existing customer auth
     * boundary. Buyer mode resolves the public Website.
     * Marketing mode remains anonymous.
     */
    executionStage = "resolve-rcaptain-context";

    const rcaptainContext =
      await resolveRCaptainContext({
        mode,
        websiteSlug: websiteSlug ?? undefined,
      });

    executionStage = "detect-intent";

    const intent =
      detectRCaptainIntent(message);

    console.log(
      "R-CAPTAIN Intent Detection",
      {
        mode: rcaptainContext.mode,
        intent,
        websiteId:
          rcaptainContext.website?.id ?? null,
      }
    );

    executionStage = "build-conversation-state";

    const conversationMessages: AIMessage[] =
      [
        ...messages,
        {
          role: "user",
          content: message,
        },
      ];

    const leadExtractor =
      new LeadExtractionService();

    /**
     * =====================================================
     * Rebuild Complete Lead State
     *
     * Extract information from complete conversation
     * history instead of only the latest message.
     * =====================================================
     */
    const conversationStateService =
      new ConversationStateService();

    let leadState:
      ConversationLeadState = {};

    for (
      const conversationMessage
      of conversationMessages
    ) {
      const extracted =
        leadExtractor.extractLead(
          [
            conversationMessage,
          ]
        );

      leadState =
        conversationStateService.mergeState(
          leadState,
          extracted
        );
    }

    const extractedLead =
      leadExtractor.extractLead(
        conversationMessages
      );

    leadState =
      conversationStateService.mergeState(
        leadState,
        extractedLead
      );

    /**
     * Do not log leadState. It can contain buyer PII.
     * Lead data remains application-side and is not placed
     * in the AI execution context.
     */
    console.log(
      "R-CAPTAIN Lead Extraction",
      {
        mode: rcaptainContext.mode,
        hasRequirement:
          extractedLead.hasRequirement,
        leadFieldsPresent:
          Object.keys(leadState),
      }
    );

    const qualificationService =
      new LeadQualificationService();

    /**
     * Qualification should happen on complete buyer profile.
     */
    const qualification =
      qualificationService.qualify(
        leadState,
        conversationMessages
      );

    const shouldAskQualificationQuestion =
      extractedLead.hasRequirement &&
      !qualification.readyForInquiry &&
      Boolean(
        qualification.nextQuestion
      );

    const aiService =
      new AIService(apiKey);

    let reply = "";

    /**
     * =====================================================
     * Buyer/public Website workflow
     *
     * Qualification and inquiry creation remain on the
     * existing application-side path.
     *
     * Marketing and Workspace conversations must not create
     * customer Website inquiries through this legacy path.
     * =====================================================
     */
    if (
      rcaptainContext.mode === "BUYER" &&
      shouldAskQualificationQuestion
    ) {
      reply =
        qualification.nextQuestion!;
    } else if (
      rcaptainContext.mode === "BUYER" &&
      qualification.readyForInquiry
    ) {
      const inquiryService =
        new InquiryCreationService();

      const inquiry =
        await inquiryService.createInquiry(
          leadState,
          rcaptainContext.website?.id
        );

      console.log(
        "R-CAPTAIN Inquiry Created",
        {
          inquiryId: inquiry.id,
          inquiryNumber:
            inquiry.inquiryNumber,
          websiteId:
            rcaptainContext.website?.id ?? null,
        }
      );

      reply =
        "Thank you for sharing your requirement. Our export team will contact you shortly.";
    } else {
      /**
       * =====================================================
       * Dedicated R-CAPTAIN Orchestration
       *
       * Knowledge retrieval, controlled Workspace tools,
       * Website product context, and privacy sanitization are
       * centralized in orchestration.service.ts.
       *
       * The chat route remains responsible for transport,
       * conversation state, buyer qualification, and inquiry
       * creation.
       * =====================================================
       */
      executionStage = "orchestrate-context";

      const orchestration =
        await orchestrateRCaptain({
          message,
          intent: intent.intent,
          context: rcaptainContext,
        });

      const executionContext =
        orchestration.executionContext;

      executionStage = "generate-ai-response";

      const response =
        await aiService.generateResponse(
          {
            message,
            messages,
            image: null,
            context: executionContext,
          }
        );

      reply =
        response.reply;
    }

    return NextResponse.json(
      {
        success: true,
        reply,
        mode: rcaptainContext.mode,
      }
    );
  } catch (error) {
    const errorDetails =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : {
            value: String(error),
          };

    console.error(
      "R-CAPTAIN chat error",
      {
        stage: executionStage,
        ...errorDetails,
      }
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process request.",
      },
      {
        status: 500,
      }
    );
  }
}
