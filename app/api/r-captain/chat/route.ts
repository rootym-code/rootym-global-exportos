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


    console.log(
      "R-CAPTAIN Intent Detection"
    );

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



    /**
     * =====================================================
     * Rebuild Complete Lead State
     *
     * Extract information from complete conversation
     * history instead of only latest message.
     *
     * This allows R-CAPTAIN to remember:
     *
     * Product
     * Quantity
     * Country
     * Company
     * Contact Person
     * Email
     * Phone
     *
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



    console.log(
      "R-CAPTAIN Lead Extraction"
    );

    console.log(leadState);




    const qualificationService =
      new LeadQualificationService();



    /**
     * IMPORTANT:
     *
     * Qualification should happen
     * on complete buyer profile.
     *
     * Not only latest message.
     *
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



    const productContext =
      await getRCaptainProductContext();




    const aiService =
      new AIService(apiKey);



    let reply = "";




    if (
      shouldAskQualificationQuestion
    ) {


      reply =
        qualification.nextQuestion!;


    } else if (
      qualification.readyForInquiry
    ) {


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
        message:
          "Unable to process request.",
      },
      {
        status: 500,
      }
    );

  }
}