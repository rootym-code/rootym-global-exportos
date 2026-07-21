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
  getRCaptainProductContext,
} from "@/lib/services/rcaptain/product-context.service";

import {
  detectRCaptainIntent,
} from "@/lib/services/rcaptain/intent-detection.service";

import type { AIMessage } from "@/lib/ai/types";


export async function POST(
  request: NextRequest
) {
  try {

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
      body.messages ?? [];


    const intent =
      detectRCaptainIntent(message);


    console.log("R-CAPTAIN Intent Detection");
    console.log(intent);


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


    const extractedLead =
      leadExtractor.extractLead(
        conversationMessages
      );


    console.log("R-CAPTAIN Lead Extraction");
    console.log(extractedLead);


    const conversationStateService =
      new ConversationStateService();


    const leadState:
      ConversationLeadState =
      conversationStateService.mergeState(
        {},
        extractedLead
      );


    const qualificationService =
      new LeadQualificationService();


    const qualification =
      qualificationService.qualify(
        extractedLead,
        conversationMessages
      );


    const shouldAskQualificationQuestion =
      extractedLead.hasRequirement &&
      !qualification.readyForInquiry &&
      Boolean(
        qualification.nextQuestion
      );


    const productContext =
      await getRCaptainProductContext();


    const aiService =
      new AIService(apiKey);


    let reply = "";


    if (shouldAskQualificationQuestion) {

      reply =
        qualification.nextQuestion!;

    } else if (qualification.readyForInquiry) {

      const inquiryService =
        new InquiryCreationService();


      const inquiry =
        await inquiryService.createInquiry(
          leadState
        );


      console.log(
        "R-CAPTAIN Inquiry Created",
        {
          inquiryId: inquiry.id,
          inquiryNumber: inquiry.inquiryNumber,
        }
      );


      reply =
        "Thank you for sharing your requirement. Our export team will contact you shortly.";

    } else {

      const response =
        await aiService.generateResponse(
          {
            message,
            messages,
            image: null,
            context: productContext,
          }
        );


      reply =
        response.reply;
    }


    return NextResponse.json(
      {
        success: true,
        reply,
      }
    );


  } catch (error) {

    console.error(
      "R-CAPTAIN chat error:",
      error
    );


    return NextResponse.json(
      {
        success: false,
        message: "Unable to process request.",
      },
      {
        status: 500,
      }
    );
  }
}
