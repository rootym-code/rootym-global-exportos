/**

* ============================================================
* ROOTYM Global ExportOS — Admin Support Tickets API
* ============================================================
* Author: Prem Singh
* Purpose: Provides the Admin Support Ticket queue API for
* ```
       authenticated Admin users, including pagination,
  ```
* ```
       search, status, priority, category and assignment
  ```
* ```
       filters.
  ```
* ============================================================
  */

  import { NextRequest, NextResponse } from "next/server";

  import { authenticateAdmin } from "@/lib/auth";
  import {
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
  } from "@/lib/generated/prisma";
  import { listAdminSupportTickets } from "@/lib/services/support/admin-support-ticket.service";
  
  function parsePositiveInteger(
  value: string | null,
  fallback: number,
  ): number {
  if (!value) {
  return fallback;
  }
  
  const parsed = Number(value);
  
  if (!Number.isFinite(parsed) || parsed < 1) {
  return fallback;
  }
  
  return Math.floor(parsed);
  }
  
  function getEnumValue<T extends string>(
  value: string | null,
  enumObject: Record<string, T>,
  ): T | undefined {
  if (!value) {
  return undefined;
  }
  
  return Object.values(enumObject).includes(value as T)
  ? (value as T)
  : undefined;
  }
  
  export async function GET(request: NextRequest) {
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
  
  const { searchParams } = new URL(request.url);
  
  const page = parsePositiveInteger(
    searchParams.get("page"),
    1,
  );
  
  const limit = Math.min(
    parsePositiveInteger(
      searchParams.get("limit"),
      25,
    ),
    100,
  );
  
  const search =
    searchParams.get("search")?.trim() || undefined;
  
  const status = getEnumValue(
    searchParams.get("status"),
    SupportTicketStatus,
  );
  
  const priority = getEnumValue(
    searchParams.get("priority"),
    SupportTicketPriority,
  );
  
  const category = getEnumValue(
    searchParams.get("category"),
    SupportTicketCategory,
  );
  
  const assignedToParam =
    searchParams.get("assignedToId");
  
  const assignedToId =
    assignedToParam === null
      ? undefined
      : assignedToParam.trim() === ""
        ? null
        : assignedToParam.trim();
  
  const tenantId =
    searchParams.get("tenantId")?.trim() || undefined;
  
  const websiteId =
    searchParams.get("websiteId")?.trim() || undefined;
  
  const dateFromParam =
    searchParams.get("dateFrom");
  
  const dateToParam =
    searchParams.get("dateTo");
  
  const dateFrom = dateFromParam
    ? new Date(dateFromParam)
    : undefined;
  
  const dateTo = dateToParam
    ? new Date(dateToParam)
    : undefined;
  
  if (
    dateFrom &&
    Number.isNaN(dateFrom.getTime())
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid dateFrom value.",
      },
      {
        status: 400,
      },
    );
  }
  
  if (
    dateTo &&
    Number.isNaN(dateTo.getTime())
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid dateTo value.",
      },
      {
        status: 400,
      },
    );
  }
  
  const offset = (page - 1) * limit;
  
  const result = await listAdminSupportTickets({
    status,
    priority,
    category,
    assignedToId,
    tenantId,
    websiteId,
    search,
    dateFrom,
    dateTo,
    limit,
    offset,
  });
  
  return NextResponse.json({
    success: true,
    tickets: result.tickets,
    pagination: {
      page,
      limit: result.limit,
      offset: result.offset,
      totalRecords: result.total,
      totalPages: Math.ceil(
        result.total / result.limit,
      ),
    },
    filters: {
      search: search ?? null,
      status: status ?? null,
      priority: priority ?? null,
      category: category ?? null,
      assignedToId:
        assignedToId === undefined
          ? null
          : assignedToId,
      tenantId: tenantId ?? null,
      websiteId: websiteId ?? null,
      dateFrom: dateFrom?.toISOString() ?? null,
      dateTo: dateTo?.toISOString() ?? null,
    },
  });

  
  } catch (error) {
  console.error(
  "Admin Support Tickets GET error:",
  error,
  );
  
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
  