/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Sprint          : 10.4.2
 * Feature         : Generate AI WhatsApp Reply
 *
 * Description
 * ------------------------------------------------------------
 * Generates an AI-powered WhatsApp draft for an inquiry.
 * The generated reply is stored as a DRAFT and can later be
 * edited, regenerated or sent through Meta WhatsApp.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";

import { AIService } from "@/lib/ai/AIService";
import {
  AIRequest,
  AIResponse,
} from "@/lib/ai/types";

import {
  MessageDirection,
  WhatsAppMessageStatus,
} from "@/lib/generated/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const WHATSAPP_REPLY_PROMPT = `
You are R-CAPTAIN,
the AI Export Sales Executive of
ROOTYM Agro Harvest Pvt. Ltd.

Generate a professional WhatsApp reply.

Rules:

- Thank the customer.
- Mention the requested product.
- Mention ROOTYM.
- Keep the reply concise.
- Be professional.
- Do not use markdown.
- Do not use bullet points.
- Do not use emojis.
- Invite further discussion.
- End politely.

Return ONLY the WhatsApp message.
`;

function buildCustomerContext(inquiry: {
  companyName: string;
  contactPerson: string;
  country: string;
  product: string;
  quantity: string | null;
  unit: string | null;
  message: string;
}) {
  return [
    `Company: ${inquiry.companyName}`,
    `Contact Person: ${inquiry.contactPerson}`,
    `Country: ${inquiry.country}`,
    `Product: ${inquiry.product}`,
    `Quantity: ${inquiry.quantity ?? "Not specified"}`,
    `Unit: ${inquiry.unit ?? "Not specified"}`,
    `Customer Message: ${inquiry.message}`,
  ].join("\n");
}

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const auth = await authenticateAdmin(request);

    if (!auth.authenticated || !auth.admin) {
      return NextResponse.json(
        {
          success: false,
          message: auth.error,
        },
        {
          status: auth.status,
        }
      );
    }

    const { id } = await params;

    const inquiry = await prisma.inquiry.findUnique({
      where: {
        id,
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        {
          success: false,
          message: "Inquiry not found.",
        },
        {
          status: 404,
        }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Gemini API key is missing.",
        },
        {
          status: 500,
        }
      );
    }

    const prompt = `
${WHATSAPP_REPLY_PROMPT}

Customer Inquiry

${buildCustomerContext(inquiry)}
`.trim();

    const aiService = new AIService(apiKey);

    const aiRequest: AIRequest = {
      message: prompt,

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      context: "Generate WhatsApp export reply.",
    };

    const aiResponse: AIResponse =
      await aiService.generateResponse(aiRequest);

    const reply = aiResponse.reply.trim();

    if (!reply) {
      return NextResponse.json(
        {
          success: false,
          message:
            "AI did not generate a response.",
        },
        {
          status: 500,
        }
      );
    }

    const existingDraft =
      await prisma.whatsAppMessage.findFirst({
        where: {
          inquiryId: inquiry.id,
          status: WhatsAppMessageStatus.DRAFT,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      let draft;

      if (existingDraft) {
        draft = await prisma.whatsAppMessage.update({
          where: {
            id: existingDraft.id,
          },
          data: {
            message: reply,
            status: WhatsAppMessageStatus.DRAFT,
            updatedAt: new Date(),
          },
        });
      } else {
        draft = await prisma.whatsAppMessage.create({
          data: {
            inquiryId: inquiry.id,
  
            direction: MessageDirection.OUTBOUND,
  
            message: reply,
  
            status: WhatsAppMessageStatus.DRAFT,
          },
        });
      }
  
      return NextResponse.json({
        success: true,
  
        message:
          "WhatsApp draft generated successfully.",
  
        draft,
      });
    } catch (error) {
      console.error(
        "WhatsApp Generate Error",
        error
      );
  
      return NextResponse.json(
        {
          success: false,
  
          message:
            error instanceof Error
              ? error.message
              : "Internal Server Error",
        },
        {
          status: 500,
        }
      );
    }
  }
  
  // END OF FILE