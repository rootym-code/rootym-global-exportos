/**
 * ============================================================
 * ROOTYM Customer Support Ticket Detail API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authenticated customer access to an individual
 *          Support Ticket, customer replies, and ticket reopening.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";
import { requireCustomerSession } from "@/lib/auth/customer";
import {
  addCustomerReply,
  getCustomerSupportTicket,
  reopenCustomerSupportTicket,
} from "@/lib/services/support/support-ticket.service";

type RouteContext = {
  params: Promise<{
    ticketId: string;
  }>;
};

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  const auth = await requireCustomerSession(request);

  if (!auth.ok) {
    return NextResponse.json(
      {
        success: false,
        error: auth.error,
      },
      { status: auth.status },
    );
  }

  const { ticketId } = await context.params;

  if (!ticketId) {
    return NextResponse.json(
      {
        success: false,
        error: "Ticket ID is required.",
      },
      { status: 400 },
    );
  }

  try {
    const ticket = await getCustomerSupportTicket(
      auth.tenant.id,
      auth.user.id,
      ticketId,
    );

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: "Support ticket not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error("GET /api/support/tickets/[ticketId] failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load the support ticket.",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  const auth = await requireCustomerSession(request);

  if (!auth.ok) {
    return NextResponse.json(
      {
        success: false,
        error: auth.error,
      },
      { status: auth.status },
    );
  }

  const { ticketId } = await context.params;

  if (!ticketId) {
    return NextResponse.json(
      {
        success: false,
        error: "Ticket ID is required.",
      },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const message = normalizeText(body?.message);

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: "Reply message is required.",
        },
        { status: 400 },
      );
    }

    const result = await addCustomerReply({
      tenantId: auth.tenant.id,
      userId: auth.user.id,
      ticketId,
      message,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("POST /api/support/tickets/[ticketId] failed:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to add the reply.";

    if (
      message.toLowerCase().includes("not found") ||
      message.toLowerCase().includes("closed") ||
      message.toLowerCase().includes("resolved")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unable to add the reply.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  const auth = await requireCustomerSession(request);

  if (!auth.ok) {
    return NextResponse.json(
      {
        success: false,
        error: auth.error,
      },
      { status: auth.status },
    );
  }

  const { ticketId } = await context.params;

  if (!ticketId) {
    return NextResponse.json(
      {
        success: false,
        error: "Ticket ID is required.",
      },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();
    const action = normalizeText(body?.action).toUpperCase();

    if (action !== "REOPEN") {
      return NextResponse.json(
        {
          success: false,
          error: "Supported action is REOPEN.",
        },
        { status: 400 },
      );
    }

    const reason =
      normalizeText(body?.reason) ||
      "Customer reopened the support ticket.";

    const ticket = await reopenCustomerSupportTicket(
      auth.tenant.id,
      auth.user.id,
      ticketId,
      reason,
    );

    return NextResponse.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error("PATCH /api/support/tickets/[ticketId] failed:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unable to reopen the support ticket.";

    if (message.toLowerCase().includes("not found")) {
      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        { status: 404 },
      );
    }

    if (
      message.toLowerCase().includes("resolved") ||
      message.toLowerCase().includes("reopen")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unable to reopen the support ticket.",
      },
      { status: 500 },
    );
  }
}