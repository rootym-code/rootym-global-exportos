 /**
  * ============================================================
  * ROOTYM Customer Support API
  * ============================================================
  * Author: Prem Singh
  * Purpose: Provides the authenticated customer API for creating
  *          and listing tenant-owned Support Tickets.
  * ============================================================
  */

 import {
    NextRequest,
    NextResponse,
  } from "next/server";
  
  import {
    SupportTicketCategory,
    SupportTicketPriority,
    SupportTicketStatus,
  } from "@/lib/generated/prisma";
  
  import {
    requireCustomerSession,
  } from "@/lib/auth/customer";
  
  import {
    createSupportTicket,
    listCustomerSupportTickets,
  } from "@/lib/services/support/support-ticket.service";
  
  /* ============================================================================
   * ENUM PARSERS
   * ============================================================================
   */
  
  function parseSupportTicketCategory(
    value: unknown,
  ): SupportTicketCategory {
    if (
      typeof value === "string" &&
      Object.values(SupportTicketCategory).includes(
        value as SupportTicketCategory,
      )
    ) {
      return value as SupportTicketCategory;
    }
  
    throw new Error(
      "A valid support ticket category is required.",
    );
  }
  
  function parseSupportTicketPriority(
    value: unknown,
  ): SupportTicketPriority {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return SupportTicketPriority.MEDIUM;
    }
  
    if (
      typeof value === "string" &&
      Object.values(SupportTicketPriority).includes(
        value as SupportTicketPriority,
      )
    ) {
      return value as SupportTicketPriority;
    }
  
    throw new Error(
      "A valid support ticket priority is required.",
    );
  }
  
  function parseSupportTicketStatus(
    value: string | null,
  ): SupportTicketStatus | undefined {
    if (!value) {
      return undefined;
    }
  
    if (
      Object.values(SupportTicketStatus).includes(
        value as SupportTicketStatus,
      )
    ) {
      return value as SupportTicketStatus;
    }
  
    throw new Error(
      "A valid support ticket status is required.",
    );
  }
  
  function parsePositiveInteger(
    value: string | null,
    defaultValue: number,
  ): number {
    if (value === null || value === "") {
      return defaultValue;
    }
  
    const parsed = Number(value);
  
    if (
      !Number.isFinite(parsed) ||
      parsed < 0
    ) {
      throw new Error(
        "Pagination values must be valid non-negative numbers.",
      );
    }
  
    return Math.floor(parsed);
  }
  
  /* ============================================================================
   * GET — List Customer Support Tickets
   * ============================================================================
   *
   * Returns only tickets created by the authenticated customer.
   *
   * The tenant and customer identity are taken exclusively from
   * the authenticated customer session.
   */
  
  export async function GET(
    request: NextRequest,
  ) {
    try {
      /* ------------------------------------------------------------------------
       * 1. Authenticate the customer and resolve tenant context.
       * ------------------------------------------------------------------------
       */
  
      const session =
        await requireCustomerSession(request);
  
      if (!session.ok) {
        return NextResponse.json(
          {
            success: false,
            message: session.error,
          },
          {
            status: session.status,
          },
        );
      }
  
      /* ------------------------------------------------------------------------
       * 2. Read optional filters and pagination.
       * ------------------------------------------------------------------------
       */
  
      const searchParams =
        request.nextUrl.searchParams;
  
      const status =
        parseSupportTicketStatus(
          searchParams.get("status"),
        );
  
      const limit =
        parsePositiveInteger(
          searchParams.get("limit"),
          25,
        );
  
      const offset =
        parsePositiveInteger(
          searchParams.get("offset"),
          0,
        );
  
      /* ------------------------------------------------------------------------
       * 3. Query tickets using authenticated tenant + user context.
       * ------------------------------------------------------------------------
       */
  
      const result =
        await listCustomerSupportTickets({
          tenantId: session.tenant.id,
          userId: session.user.id,
          status,
          limit,
          offset,
        });
  
      /* ------------------------------------------------------------------------
       * 4. Return customer-safe ticket list.
       * ------------------------------------------------------------------------
       */
  
      return NextResponse.json(
        {
          success: true,
          data: result,
        },
        {
          status: 200,
        },
      );
    } catch (error) {
      console.error(
        "GET /api/support/tickets",
        error,
      );
  
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load support tickets.";
  
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
  
  /* ============================================================================
   * POST — Create Customer Support Ticket
   * ============================================================================
   *
   * Creates a new Support Ticket owned by the authenticated tenant
   * and authenticated customer.
   *
   * The browser is never allowed to provide tenantId or userId.
   */
  
  export async function POST(
    request: NextRequest,
  ) {
    try {
      /* ------------------------------------------------------------------------
       * 1. Authenticate the customer and resolve tenant context.
       * ------------------------------------------------------------------------
       */
  
      const session =
        await requireCustomerSession(request);
  
      if (!session.ok) {
        return NextResponse.json(
          {
            success: false,
            message: session.error,
          },
          {
            status: session.status,
          },
        );
      }
  
      /* ------------------------------------------------------------------------
       * 2. Parse JSON request body.
       * ------------------------------------------------------------------------
       */
  
      let body: unknown;
  
      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          {
            success: false,
            message:
              "A valid JSON request body is required.",
          },
          {
            status: 400,
          },
        );
      }
  
      if (
        typeof body !== "object" ||
        body === null
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "A valid support ticket request body is required.",
          },
          {
            status: 400,
          },
        );
      }
  
      const payload =
        body as Record<string, unknown>;
  
      /* ------------------------------------------------------------------------
       * 3. Extract customer-submitted ticket fields.
       * ------------------------------------------------------------------------
       *
       * tenantId and userId are intentionally NOT read from the body.
       *
       * websiteId may be supplied when the customer wants the ticket
       * associated with a particular website. The support service
       * validates that the website belongs to the authenticated tenant.
       */
  
      const subject =
        typeof payload.subject === "string"
          ? payload.subject
          : "";
  
      const description =
        typeof payload.description === "string"
          ? payload.description
          : "";
  
      const websiteId =
        typeof payload.websiteId === "string" &&
        payload.websiteId.trim()
          ? payload.websiteId.trim()
          : null;
  
      const category =
        parseSupportTicketCategory(
          payload.category,
        );
  
      const priority =
        parseSupportTicketPriority(
          payload.priority,
        );
  
      /* ------------------------------------------------------------------------
       * 4. Create the support ticket.
       * ------------------------------------------------------------------------
       *
       * Tenant and user ownership come exclusively from the
       * authenticated customer session.
       */
  
      const ticket =
        await createSupportTicket({
          tenantId: session.tenant.id,
          userId: session.user.id,
          websiteId,
          subject,
          description,
          category,
          priority,
        });
  
      /* ------------------------------------------------------------------------
       * 5. Return the created ticket.
       * ------------------------------------------------------------------------
       */
  
      return NextResponse.json(
        {
          success: true,
          message:
            "Support ticket created successfully.",
          data: {
            ticket,
          },
        },
        {
          status: 201,
        },
      );
    } catch (error) {
      console.error(
        "POST /api/support/tickets",
        error,
      );
  
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create support ticket.";
  
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