/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Sprint          : 10.4.2
 * Feature         : Regenerate AI WhatsApp Reply
 *
 * Description
 * ------------------------------------------------------------
 * Regenerates an existing WhatsApp draft using AI.
 * The existing message is updated and reset to DRAFT so it can
 * be reviewed and approved again.
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
  WhatsAppMessageStatus,
} from "@/lib/generated/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
    messageId: string;
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

    const {
      id,
      messageId,
    } = await params;

    const inquiry =
      await prisma.inquiry.findUnique({
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

    const existingMessage =
      await prisma.whatsAppMessage.findUnique({
        where: {
          id: messageId,
        },
      });

    if (!existingMessage) {
      return NextResponse.json(
        {
          success: false,
          message: "WhatsApp message not found.",
        },
        {
          status: 404,
        }
      );
    }

    const apiKey =
      process.env.GEMINI_API_KEY;

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

    const aiService =
      new AIService(apiKey);

    const aiRequest: AIRequest = {
      message: prompt,

      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],

      context:
        "Generate WhatsApp export reply.",
    };

    const aiResponse: AIResponse =
      await aiService.generateResponse(
        aiRequest
      );

    const reply =
      aiResponse.reply.trim();

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

    const draft =
      await prisma.whatsAppMessage.update({
        where: {
          id: messageId,
        },
        data: {
          message: reply,
          status:
            WhatsAppMessageStatus.DRAFT,
          approvedAt: null,
          approvedBy: null,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({
      success: true,
      message:
        "WhatsApp draft regenerated successfully.",
      draft,
    });

  } catch (error) {
    console.error(
      "WhatsApp Regenerate Error",
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