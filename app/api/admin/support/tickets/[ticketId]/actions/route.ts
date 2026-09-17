/**
 * ============================================================
 * ROOTYM Global ExportOS — Admin Support Ticket Actions API
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authenticated Admin actions for Support
 *          Tickets including replies, internal notes,
 *          assignment, status changes, resolution and closure.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";
import { SupportTicketStatus } from "@/lib/generated/prisma";
import {
  addAdminInternalNote,
  addAdminSupportReply,
  assignAdminSupportTicket,
  changeAdminSupportTicketStatus,
  closeAdminSupportTicket,
  resolveAdminSupportTicket,
} from "@/lib/services/support/admin-support-ticket.service";

interface RouteContext {
  params: Promise<{
    ticketId: string;
  }>;
}

interface ActionRequestBody {
  action?: string;
  message?: string;
  note?: string;
  assignedToId?: string;
  status?: SupportTicketStatus;
}

function getEnumValue<T extends string>(
  value: unknown,
  enumObject: Record<string, T>,
): T | undefined {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }

  return Object.values(enumObject).includes(value as T)
    ? (value as T)
    : undefined;
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const auth = await authenticateAdmin(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: auth.error,
        },
        {
          status: auth.status,
        },
      );
    }

    const adminId = auth.admin?.adminId;

    if (!adminId) {
      return NextResponse.json(
        {
          success: false,
          message: "Authenticated Admin context is missing.",
        },
        {
          status: 401,
        },
      );
    }

    const { ticketId } = await context.params;

    if (!ticketId?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Ticket ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    let body: ActionRequestBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        {
          status: 400,
        },
      );
    }

    const action =
      typeof body.action === "string"
        ? body.action.trim().toLowerCase()
        : "";

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          message: "Action is required.",
        },
        {
          status: 400,
        },
      );
    }

    const normalizedTicketId = ticketId.trim();

    switch (action) {
      case "reply": {
        if (
          typeof body.message !== "string" ||
          !body.message.trim()
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "Message is required for a reply.",
            },
            {
              status: 400,
            },
          );
        }

        const result = await addAdminSupportReply({
          adminId,
          ticketId: normalizedTicketId,
          message: body.message,
        });

        return NextResponse.json({
          success: true,
          message: "Admin reply added successfully.",
          data: result,
        });
      }

      case "internal_note":
      case "internal-note":
      case "note": {
        if (
          typeof body.note !== "string" ||
          !body.note.trim()
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "Note is required for an internal note.",
            },
            {
              status: 400,
            },
          );
        }

        const result = await addAdminInternalNote({
          adminId,
          ticketId: normalizedTicketId,
          note: body.note,
        });

        return NextResponse.json({
          success: true,
          message: "Internal note added successfully.",
          data: result,
        });
      }

      case "assign": {
        if (
          typeof body.assignedToId !== "string" ||
          !body.assignedToId.trim()
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "assignedToId is required for assignment.",
            },
            {
              status: 400,
            },
          );
        }

        const result = await assignAdminSupportTicket({
          adminId,
          ticketId: normalizedTicketId,
          assignedToId: body.assignedToId.trim(),
          note:
            typeof body.note === "string"
              ? body.note
              : undefined,
        });

        return NextResponse.json({
          success: true,
          message: "Support ticket assigned successfully.",
          data: result,
        });
      }

      case "status": {
        const status = getEnumValue(
          body.status,
          SupportTicketStatus,
        );

        if (!status) {
          return NextResponse.json(
            {
              success: false,
              message:
                "A valid Support Ticket status is required.",
            },
            {
              status: 400,
            },
          );
        }

        const result =
          await changeAdminSupportTicketStatus({
            adminId,
            ticketId: normalizedTicketId,
            status,
            note:
              typeof body.note === "string"
                ? body.note
                : undefined,
          });

        return NextResponse.json({
          success: true,
          message:
            "Support ticket status updated successfully.",
          data: result,
        });
      }

      case "resolve": {
        const result =
          await resolveAdminSupportTicket({
            adminId,
            ticketId: normalizedTicketId,
            note:
              typeof body.note === "string"
                ? body.note
                : undefined,
          });

        return NextResponse.json({
          success: true,
          message: "Support ticket resolved successfully.",
          data: result,
        });
      }

      case "close": {
        const result =
          await closeAdminSupportTicket({
            adminId,
            ticketId: normalizedTicketId,
            note:
              typeof body.note === "string"
                ? body.note
                : undefined,
          });

        return NextResponse.json({
          success: true,
          message: "Support ticket closed successfully.",
          data: result,
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            message: `Unsupported action: ${action}.`,
            supportedActions: [
              "reply",
              "internal_note",
              "assign",
              "status",
              "resolve",
              "close",
            ],
          },
          {
            status: 400,
          },
        );
    }
  } catch (error) {
    console.error(
      "Admin Support Ticket action error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Internal Server Error";

    if (
      message === "Support ticket not found." ||
      message === "Active Admin account not found."
    ) {
      return NextResponse.json(
        {
          success: false,
          message,
        },
        {
          status: 404,
        },
      );
    }

    if (
      message.includes("Closed support tickets") ||
      message.includes("Closed support ticket") ||
      message.includes("Only resolved support tickets") ||
      message.includes("cannot be reopened") ||
      message.includes("Use closeAdminSupportTicket")
    ) {
      return NextResponse.json(
        {
          success: false,
          message,
        },
        {
          status: 409,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status: 400,
      },
    );
  }
}