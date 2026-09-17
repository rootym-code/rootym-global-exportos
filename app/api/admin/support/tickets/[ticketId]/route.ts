/**

* ============================================================
* ROOTYM Global ExportOS — Admin Support Ticket Detail API
* ============================================================
* Author: Prem Singh
* Purpose: Provides the Admin Support Center with authenticated
* ```
       access to a complete Support Ticket, including
  ```
* ```
       customer information, messages, internal notes,
  ```
* ```
       attachments, assignment and status history.
  ```
* ============================================================
  */

  import { NextRequest, NextResponse } from "next/server";

  import { authenticateAdmin } from "@/lib/auth";
  import { getAdminSupportTicket } from "@/lib/services/support/admin-support-ticket.service";
  
  interface RouteContext {
  params: Promise<{
  ticketId: string;
  }>;
  }
  
  export async function GET(
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
  
  const ticket = await getAdminSupportTicket(
    ticketId.trim(),
  );
  
  return NextResponse.json({
    success: true,
    ticket,
  });
  } catch (error) {
  console.error(
  "Admin Support Ticket GET error:",
  error,
  );
  
  const message =
    error instanceof Error
      ? error.message
      : "Internal Server Error";
  
  if (message === "Support ticket not found.") {
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
  
  if (message === "Ticket ID is required.") {
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
  
  return NextResponse.json(
    {
      success: false,
      message: "Internal Server Error",
    },
    {
      status: 500,
    },
  );
 
  }
  }