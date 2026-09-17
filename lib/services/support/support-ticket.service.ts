/**
 * Author: Prem Singh
 * Purpose: Provides the customer-facing Support Ticket service layer for
 *          ROOTYM Global ExportOS, including ticket creation, retrieval,
 *          customer replies, and tenant-safe status history.
 */

import prisma from "@/lib/prisma";
import {
  SupportMessageType,
  SupportMessageVisibility,
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/lib/generated/prisma";
import {
  getNextSupportTicketNumber,
} from "@/lib/services/number-generator.service";

export interface CreateSupportTicketInput {
  tenantId: string;
  userId: string;
  websiteId?: string | null;
  subject: string;
  description: string;
  category: SupportTicketCategory;
  priority?: SupportTicketPriority;
}

export interface AddCustomerReplyInput {
  tenantId: string;
  userId: string;
  ticketId: string;
  message: string;
}

export interface ListCustomerTicketsInput {
  tenantId: string;
  userId: string;
  status?: SupportTicketStatus;
  limit?: number;
  offset?: number;
}

const customerTicketInclude = {
  website: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  assignedTo: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  messages: {
    where: {
      visibility: SupportMessageVisibility.CUSTOMER,
    },
    orderBy: {
      sequence: "asc" as const,
    },
    include: {
      authorUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      authorAdmin: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      attachments: {
        include: {
          media: true,
        },
      },
    },
  },
  attachments: {
    include: {
      media: true,
    },
  },
  statusHistory: {
    orderBy: {
      createdAt: "asc" as const,
    },
    include: {
      changedByUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      changedByAdmin: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
} as const;

function normalizeText(value: string, fieldName: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalized;
}

function normalizeLimit(limit?: number): number {
  if (!limit || !Number.isFinite(limit)) {
    return 25;
  }

  return Math.min(Math.max(Math.floor(limit), 1), 100);
}

function normalizeOffset(offset?: number): number {
  if (!offset || !Number.isFinite(offset)) {
    return 0;
  }

  return Math.max(Math.floor(offset), 0);
}

async function resolveCustomerWebsite(
  tenantId: string,
  websiteId?: string | null,
) {
  if (!websiteId) {
    return null;
  }

  const website = await prisma.website.findFirst({
    where: {
      id: websiteId,
      tenantId,
      isActive: true,
    },
    select: {
      id: true,
      tenantId: true,
      name: true,
      slug: true,
    },
  });

  if (!website) {
    throw new Error("Website not found for the authenticated tenant.");
  }

  return website;
}

async function resolveCustomerTicket(
  tenantId: string,
  userId: string,
  ticketId: string,
) {
  const ticket = await prisma.supportTicket.findFirst({
    where: {
      id: ticketId,
      tenantId,
      createdById: userId,
    },
    include: customerTicketInclude,
  });

  if (!ticket) {
    throw new Error("Support ticket not found.");
  }

  return ticket;
}

/**
 * Creates a new customer support ticket.
 *
 * The ticket is always owned by the authenticated tenant and user.
 * An optional websiteId is accepted only when that website belongs
 * to the same authenticated tenant.
 */
export async function createSupportTicket(
  input: CreateSupportTicketInput,
) {
  const subject = normalizeText(input.subject, "Subject");
  const description = normalizeText(input.description, "Description");

  if (!input.tenantId) {
    throw new Error("Tenant context is required.");
  }

  if (!input.userId) {
    throw new Error("Customer user context is required.");
  }

  const website = await resolveCustomerWebsite(
    input.tenantId,
    input.websiteId,
  );

  const ticketNumber = await getNextSupportTicketNumber();

  const ticket = await prisma.$transaction(async (tx) => {
    const createdTicket = await tx.supportTicket.create({
      data: {
        tenantId: input.tenantId,
        websiteId: website?.id ?? null,
        ticketNumber,
        subject,
        description,
        category: input.category,
        priority: input.priority ?? SupportTicketPriority.MEDIUM,
        status: SupportTicketStatus.OPEN,
        createdById: input.userId,
      },
    });

    await tx.supportMessage.create({
      data: {
        ticketId: createdTicket.id,
        authorUserId: input.userId,
        message: description,
        messageType: SupportMessageType.REPLY,
        visibility: SupportMessageVisibility.CUSTOMER,
        sequence: 1,
      },
    });

    await tx.supportTicketStatusHistory.create({
      data: {
        ticketId: createdTicket.id,
        oldStatus: null,
        newStatus: SupportTicketStatus.OPEN,
        changedByUserId: input.userId,
      },
    });

    return createdTicket;
  });

  return prisma.supportTicket.findUniqueOrThrow({
    where: {
      id: ticket.id,
    },
    include: customerTicketInclude,
  });
}

/**
 * Lists tickets created by the authenticated customer.
 *
 * Both tenantId and createdById are enforced so a customer cannot
 * access another customer's ticket within the same tenant.
 */
export async function listCustomerSupportTickets(
  input: ListCustomerTicketsInput,
) {
  if (!input.tenantId) {
    throw new Error("Tenant context is required.");
  }

  if (!input.userId) {
    throw new Error("Customer user context is required.");
  }

  const limit = normalizeLimit(input.limit);
  const offset = normalizeOffset(input.offset);

  const where = {
    tenantId: input.tenantId,
    createdById: input.userId,
    ...(input.status ? { status: input.status } : {}),
  };

  const [tickets, total] = await prisma.$transaction([
    prisma.supportTicket.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
      },
      skip: offset,
      take: limit,
      include: {
        website: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                visibility: SupportMessageVisibility.CUSTOMER,
              },
            },
          },
        },
      },
    }),
    prisma.supportTicket.count({
      where,
    }),
  ]);

  return {
    tickets,
    total,
    limit,
    offset,
  };
}

/**
 * Retrieves one customer-owned support ticket together with:
 * - customer-visible conversation
 * - attachments
 * - status history
 * - assignment information
 */
export async function getCustomerSupportTicket(
  tenantId: string,
  userId: string,
  ticketId: string,
) {
  if (!tenantId) {
    throw new Error("Tenant context is required.");
  }

  if (!userId) {
    throw new Error("Customer user context is required.");
  }

  if (!ticketId) {
    throw new Error("Ticket ID is required.");
  }

  return resolveCustomerTicket(tenantId, userId, ticketId);
}

/**
 * Adds a customer reply to an existing ticket.
 *
 * Customer replies are never allowed on CLOSED tickets.
 * When a customer responds to WAITING_FOR_CUSTOMER, the ticket
 * moves back to IN_PROGRESS and the transition is recorded.
 */
export async function addCustomerReply(
  input: AddCustomerReplyInput,
) {
  const message = normalizeText(input.message, "Message");

  if (!input.tenantId) {
    throw new Error("Tenant context is required.");
  }

  if (!input.userId) {
    throw new Error("Customer user context is required.");
  }

  if (!input.ticketId) {
    throw new Error("Ticket ID is required.");
  }

  const existingTicket = await prisma.supportTicket.findFirst({
    where: {
      id: input.ticketId,
      tenantId: input.tenantId,
      createdById: input.userId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!existingTicket) {
    throw new Error("Support ticket not found.");
  }

  if (existingTicket.status === SupportTicketStatus.CLOSED) {
    throw new Error("Closed support tickets cannot receive new replies.");
  }

  if (existingTicket.status === SupportTicketStatus.RESOLVED) {
    throw new Error(
      "Resolved support tickets cannot receive new replies. Please raise a new issue if further assistance is required.",
    );
  }

  const result = await prisma.$transaction(
    async (tx) => {
      const latestMessage = await tx.supportMessage.findFirst({
        where: {
          ticketId: existingTicket.id,
        },
        orderBy: {
          sequence: "desc",
        },
        select: {
          sequence: true,
        },
      });

      const nextSequence = (latestMessage?.sequence ?? 0) + 1;

      const createdMessage = await tx.supportMessage.create({
        data: {
          ticketId: existingTicket.id,
          authorUserId: input.userId,
          message,
          messageType: SupportMessageType.REPLY,
          visibility: SupportMessageVisibility.CUSTOMER,
          sequence: nextSequence,
        },
      });

      if (
        existingTicket.status === SupportTicketStatus.WAITING_FOR_CUSTOMER
      ) {
        await tx.supportTicket.update({
          where: {
            id: existingTicket.id,
          },
          data: {
            status: SupportTicketStatus.IN_PROGRESS,
          },
        });

        await tx.supportTicketStatusHistory.create({
          data: {
            ticketId: existingTicket.id,
            oldStatus: SupportTicketStatus.WAITING_FOR_CUSTOMER,
            newStatus: SupportTicketStatus.IN_PROGRESS,
            changedByUserId: input.userId,
            note: "Customer replied to the support ticket.",
          },
        });
      }

      return createdMessage;
    },
    {
      isolationLevel: "Serializable",
    },
  );

  return {
    message: result,
    ticket: await getCustomerSupportTicket(
      input.tenantId,
      input.userId,
      input.ticketId,
    ),
  };
}

/**
 * Reopens a customer-owned RESOLVED ticket by creating a new
 * support conversation state.
 *
 * This is intentionally separate from addCustomerReply so that
 * reopening remains an explicit business operation.
 */
export async function reopenCustomerSupportTicket(
  tenantId: string,
  userId: string,
  ticketId: string,
  reason: string,
) {
  const normalizedReason = normalizeText(reason, "Reason");

  const ticket = await prisma.supportTicket.findFirst({
    where: {
      id: ticketId,
      tenantId,
      createdById: userId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!ticket) {
    throw new Error("Support ticket not found.");
  }

  if (ticket.status !== SupportTicketStatus.RESOLVED) {
    throw new Error("Only resolved tickets can be reopened.");
  }

  await prisma.$transaction(async (tx) => {
    const latestMessage = await tx.supportMessage.findFirst({
      where: {
        ticketId: ticket.id,
      },
      orderBy: {
        sequence: "desc",
      },
      select: {
        sequence: true,
      },
    });

    await tx.supportTicket.update({
      where: {
        id: ticket.id,
      },
      data: {
        status: SupportTicketStatus.IN_PROGRESS,
        resolvedAt: null,
        resolvedById: null,
      },
    });

    await tx.supportMessage.create({
      data: {
        ticketId: ticket.id,
        authorUserId: userId,
        message: normalizedReason,
        messageType: SupportMessageType.REPLY,
        visibility: SupportMessageVisibility.CUSTOMER,
        sequence: (latestMessage?.sequence ?? 0) + 1,
      },
    });

    await tx.supportTicketStatusHistory.create({
      data: {
        ticketId: ticket.id,
        oldStatus: SupportTicketStatus.RESOLVED,
        newStatus: SupportTicketStatus.IN_PROGRESS,
        changedByUserId: userId,
        note: normalizedReason,
      },
    });
  });

  return getCustomerSupportTicket(tenantId, userId, ticketId);
}

/**
 * Returns a lightweight customer-safe ticket summary.
 *
 * Useful for dashboard widgets without loading the full conversation.
 */
export async function getCustomerSupportTicketSummary(
  tenantId: string,
  userId: string,
) {
  const tickets = await prisma.supportTicket.findMany({
    where: {
      tenantId,
      createdById: userId,
    },
    select: {
      status: true,
    },
  });

  return {
    total: tickets.length,
    open: tickets.filter(
      (ticket) => ticket.status === SupportTicketStatus.OPEN,
    ).length,
    assigned: tickets.filter(
      (ticket) => ticket.status === SupportTicketStatus.ASSIGNED,
    ).length,
    inProgress: tickets.filter(
      (ticket) => ticket.status === SupportTicketStatus.IN_PROGRESS,
    ).length,
    waitingForCustomer: tickets.filter(
      (ticket) =>
        ticket.status === SupportTicketStatus.WAITING_FOR_CUSTOMER,
    ).length,
    resolved: tickets.filter(
      (ticket) => ticket.status === SupportTicketStatus.RESOLVED,
    ).length,
    closed: tickets.filter(
      (ticket) => ticket.status === SupportTicketStatus.CLOSED,
    ).length,
  };
}