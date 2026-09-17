/**
 * ============================================================
 * ROOTYM Global ExportOS — Admin Support Ticket Service
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides Admin-side Support Ticket business logic
 *          for queue management, ticket retrieval, assignment,
 *          replies, internal notes, status management,
 *          resolution, and closure.
 * ============================================================
 */

import prisma from "@/lib/prisma";
import {
  SupportMessageType,
  SupportMessageVisibility,
  SupportTicketCategory,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/lib/generated/prisma";

export interface ListAdminSupportTicketsInput {
  status?: SupportTicketStatus;
  priority?: SupportTicketPriority;
  category?: SupportTicketCategory;
  assignedToId?: string | null;
  tenantId?: string;
  websiteId?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

export interface AddAdminSupportReplyInput {
  adminId: string;
  ticketId: string;
  message: string;
}

export interface AddAdminInternalNoteInput {
  adminId: string;
  ticketId: string;
  note: string;
}

export interface AssignAdminSupportTicketInput {
  adminId: string;
  ticketId: string;
  assignedToId: string;
  note?: string;
}

export interface ChangeAdminSupportTicketStatusInput {
  adminId: string;
  ticketId: string;
  status: SupportTicketStatus;
  note?: string;
}

export interface ResolveAdminSupportTicketInput {
  adminId: string;
  ticketId: string;
  note?: string;
}

export interface CloseAdminSupportTicketInput {
  adminId: string;
  ticketId: string;
  note?: string;
}

const adminTicketInclude = {
  tenant: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  website: {
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
    },
  },
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
    },
  },
  assignedTo: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  },
  resolvedBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
  closedBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
  messages: {
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
          role: true,
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
      message: {
        select: {
          id: true,
          sequence: true,
          authorUserId: true,
          authorAdminId: true,
          messageType: true,
          visibility: true,
        },
      },
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
          role: true,
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

async function requireActiveAdmin(adminId: string) {
  if (!adminId) {
    throw new Error("Admin context is required.");
  }

  const admin = await prisma.admin.findFirst({
    where: {
      id: adminId,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!admin) {
    throw new Error("Active Admin account not found.");
  }

  return admin;
}

async function getAdminSupportTicketRecord(ticketId: string) {
  if (!ticketId) {
    throw new Error("Ticket ID is required.");
  }

  const ticket = await prisma.supportTicket.findUnique({
    where: {
      id: ticketId,
    },
    include: adminTicketInclude,
  });

  if (!ticket) {
    throw new Error("Support ticket not found.");
  }

  return ticket;
}

async function getNextMessageSequence(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  ticketId: string,
) {
  const latestMessage = await tx.supportMessage.findFirst({
    where: {
      ticketId,
    },
    orderBy: {
      sequence: "desc",
    },
    select: {
      sequence: true,
    },
  });

  return (latestMessage?.sequence ?? 0) + 1;
}

/**
 * Lists Support Tickets for the Admin queue.
 *
 * Supports status, priority, category, assignment, tenant,
 * website, text search and date filters.
 */
export async function listAdminSupportTickets(
  input: ListAdminSupportTicketsInput = {},
) {
  const limit = normalizeLimit(input.limit);
  const offset = normalizeOffset(input.offset);

  const search = input.search?.trim();

  const where = {
    ...(input.status ? { status: input.status } : {}),
    ...(input.priority ? { priority: input.priority } : {}),
    ...(input.category ? { category: input.category } : {}),
    ...(input.assignedToId !== undefined
      ? { assignedToId: input.assignedToId }
      : {}),
    ...(input.tenantId ? { tenantId: input.tenantId } : {}),
    ...(input.websiteId ? { websiteId: input.websiteId } : {}),
    ...(input.dateFrom || input.dateTo
      ? {
          createdAt: {
            ...(input.dateFrom ? { gte: input.dateFrom } : {}),
            ...(input.dateTo ? { lte: input.dateTo } : {}),
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            {
              ticketNumber: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              subject: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              tenant: {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              tenant: {
                slug: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              website: {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              createdBy: {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              createdBy: {
                email: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
          ],
        }
      : {}),
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
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
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
            role: true,
            isActive: true,
          },
        },
        _count: {
          select: {
            messages: true,
            attachments: true,
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
 * Returns dashboard counters for the Admin Support Center.
 */
export async function getAdminSupportTicketSummary() {
  const [
    total,
    open,
    assigned,
    inProgress,
    waitingForCustomer,
    resolved,
    closed,
    urgent,
    highPriority,
  ] = await prisma.$transaction([
    prisma.supportTicket.count(),
    prisma.supportTicket.count({
      where: {
        status: SupportTicketStatus.OPEN,
      },
    }),
    prisma.supportTicket.count({
      where: {
        status: SupportTicketStatus.ASSIGNED,
      },
    }),
    prisma.supportTicket.count({
      where: {
        status: SupportTicketStatus.IN_PROGRESS,
      },
    }),
    prisma.supportTicket.count({
      where: {
        status: SupportTicketStatus.WAITING_FOR_CUSTOMER,
      },
    }),
    prisma.supportTicket.count({
      where: {
        status: SupportTicketStatus.RESOLVED,
      },
    }),
    prisma.supportTicket.count({
      where: {
        status: SupportTicketStatus.CLOSED,
      },
    }),
    prisma.supportTicket.count({
      where: {
        priority: SupportTicketPriority.URGENT,
      },
    }),
    prisma.supportTicket.count({
      where: {
        priority: SupportTicketPriority.HIGH,
      },
    }),
  ]);

  return {
    total,
    open,
    assigned,
    inProgress,
    waitingForCustomer,
    resolved,
    closed,
    urgent,
    highPriority,
  };
}

/**
 * Retrieves the complete Admin view of a Support Ticket.
 *
 * Unlike the customer service, this deliberately includes
 * INTERNAL messages and complete status history.
 */
export async function getAdminSupportTicket(ticketId: string) {
  return getAdminSupportTicketRecord(ticketId);
}

/**
 * Assigns a Support Ticket to an active Admin.
 *
 * Assignment also moves OPEN tickets to ASSIGNED.
 */
export async function assignAdminSupportTicket(
  input: AssignAdminSupportTicketInput,
) {
  const note = input.note?.trim() || undefined;

  await requireActiveAdmin(input.adminId);

  if (!input.assignedToId) {
    throw new Error("Assigned Admin is required.");
  }

  const assignee = await requireActiveAdmin(input.assignedToId);

  const ticket = await prisma.supportTicket.findUnique({
    where: {
      id: input.ticketId,
    },
    select: {
      id: true,
      status: true,
      assignedToId: true,
    },
  });

  if (!ticket) {
    throw new Error("Support ticket not found.");
  }

  if (ticket.status === SupportTicketStatus.CLOSED) {
    throw new Error("Closed support tickets cannot be reassigned.");
  }

  const result = await prisma.$transaction(
    async (tx) => {
      let newStatus = ticket.status;

      if (ticket.status === SupportTicketStatus.OPEN) {
        newStatus = SupportTicketStatus.ASSIGNED;
      }

      const updatedTicket = await tx.supportTicket.update({
        where: {
          id: ticket.id,
        },
        data: {
          assignedToId: assignee.id,
          ...(newStatus !== ticket.status
            ? {
                status: newStatus,
              }
            : {}),
        },
      });

      if (newStatus !== ticket.status) {
        await tx.supportTicketStatusHistory.create({
          data: {
            ticketId: ticket.id,
            oldStatus: ticket.status,
            newStatus,
            changedByAdminId: input.adminId,
            note: note ?? `Ticket assigned to ${assignee.name}.`,
          },
        });
      }

      return updatedTicket;
    },
    {
      isolationLevel: "Serializable",
    },
  );

  return getAdminSupportTicket(result.id);
}

/**
 * Adds an Admin reply visible to the customer.
 *
 * If the ticket is WAITING_FOR_CUSTOMER, the customer response
 * cycle is reopened by moving it to IN_PROGRESS.
 */
export async function addAdminSupportReply(
  input: AddAdminSupportReplyInput,
) {
  const message = normalizeText(input.message, "Message");

  await requireActiveAdmin(input.adminId);

  const existingTicket = await prisma.supportTicket.findUnique({
    where: {
      id: input.ticketId,
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

  const result = await prisma.$transaction(
    async (tx) => {
      const nextSequence = await getNextMessageSequence(
        tx,
        existingTicket.id,
      );

      const createdMessage = await tx.supportMessage.create({
        data: {
          ticketId: existingTicket.id,
          authorAdminId: input.adminId,
          message,
          messageType: SupportMessageType.REPLY,
          visibility: SupportMessageVisibility.CUSTOMER,
          sequence: nextSequence,
        },
      });

      await tx.supportTicket.update({
        where: {
          id: existingTicket.id,
        },
        data: {
          updatedAt: new Date(),
          ...(existingTicket.status === SupportTicketStatus.WAITING_FOR_CUSTOMER
            ? {
                status: SupportTicketStatus.IN_PROGRESS,
              }
            : {}),
        },
      });

      if (existingTicket.status === SupportTicketStatus.WAITING_FOR_CUSTOMER) {

        await tx.supportTicketStatusHistory.create({
          data: {
            ticketId: existingTicket.id,
            oldStatus: SupportTicketStatus.WAITING_FOR_CUSTOMER,
            newStatus: SupportTicketStatus.IN_PROGRESS,
            changedByAdminId: input.adminId,
            note: "Admin replied to the support ticket.",
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
    ticket: await getAdminSupportTicket(input.ticketId),
  };
}

/**
 * Adds an Admin-only internal note.
 *
 * Internal notes are never customer-visible.
 */
export async function addAdminInternalNote(
  input: AddAdminInternalNoteInput,
) {
  const note = normalizeText(input.note, "Note");

  await requireActiveAdmin(input.adminId);

  const ticket = await prisma.supportTicket.findUnique({
    where: {
      id: input.ticketId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!ticket) {
    throw new Error("Support ticket not found.");
  }

  if (ticket.status === SupportTicketStatus.CLOSED) {
    throw new Error("Closed support tickets cannot receive internal notes.");
  }

  const createdMessage = await prisma.$transaction(
    async (tx) => {
      const nextSequence = await getNextMessageSequence(tx, ticket.id);

      const createdMessage = await tx.supportMessage.create({
        data: {
          ticketId: ticket.id,
          authorAdminId: input.adminId,
          message: note,
          messageType: SupportMessageType.INTERNAL_NOTE,
          visibility: SupportMessageVisibility.INTERNAL,
          sequence: nextSequence,
        },
      });

      await tx.supportTicket.update({
        where: {
          id: ticket.id,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      return createdMessage;
    },
    {
      isolationLevel: "Serializable",
    },
  );

  return {
    message: createdMessage,
    ticket: await getAdminSupportTicket(input.ticketId),
  };
}

/**
 * Changes the current ticket status and records immutable history.
 */
export async function changeAdminSupportTicketStatus(
  input: ChangeAdminSupportTicketStatusInput,
) {
  await requireActiveAdmin(input.adminId);

  const note = input.note?.trim() || undefined;

  const existingTicket = await prisma.supportTicket.findUnique({
    where: {
      id: input.ticketId,
    },
    select: {
      id: true,
      status: true,
      resolvedAt: true,
      resolvedById: true,
      closedAt: true,
      closedById: true,
    },
  });

  if (!existingTicket) {
    throw new Error("Support ticket not found.");
  }

  if (existingTicket.status === input.status) {
    return getAdminSupportTicket(input.ticketId);
  }

  if (
    existingTicket.status === SupportTicketStatus.CLOSED &&
    input.status !== SupportTicketStatus.CLOSED
  ) {
    throw new Error("Closed support tickets cannot be reopened by this operation.");
  }

  if (input.status === SupportTicketStatus.CLOSED) {
    throw new Error(
      "Use closeAdminSupportTicket() to close a support ticket.",
    );
  }

  const result = await prisma.$transaction(
    async (tx) => {
      const updatedTicket = await tx.supportTicket.update({
        where: {
          id: existingTicket.id,
        },
        data: {
          status: input.status,
          ...(input.status !== SupportTicketStatus.RESOLVED
            ? {
                resolvedAt: null,
                resolvedById: null,
              }
            : {}),
        },
      });

      await tx.supportTicketStatusHistory.create({
        data: {
          ticketId: existingTicket.id,
          oldStatus: existingTicket.status,
          newStatus: input.status,
          changedByAdminId: input.adminId,
          note,
        },
      });

      return updatedTicket;
    },
    {
      isolationLevel: "Serializable",
    },
  );

  return getAdminSupportTicket(result.id);
}

/**
 * Resolves a Support Ticket and records the resolving Admin.
 */
export async function resolveAdminSupportTicket(
  input: ResolveAdminSupportTicketInput,
) {
  await requireActiveAdmin(input.adminId);

  const note = input.note?.trim() || undefined;

  const existingTicket = await prisma.supportTicket.findUnique({
    where: {
      id: input.ticketId,
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
    throw new Error("Closed support tickets cannot be resolved.");
  }

  if (existingTicket.status === SupportTicketStatus.RESOLVED) {
    return getAdminSupportTicket(input.ticketId);
  }

  const resolvedAt = new Date();

  const result = await prisma.$transaction(
    async (tx) => {
      const updatedTicket = await tx.supportTicket.update({
        where: {
          id: existingTicket.id,
        },
        data: {
          status: SupportTicketStatus.RESOLVED,
          resolvedById: input.adminId,
          resolvedAt,
        },
      });

      await tx.supportTicketStatusHistory.create({
        data: {
          ticketId: existingTicket.id,
          oldStatus: existingTicket.status,
          newStatus: SupportTicketStatus.RESOLVED,
          changedByAdminId: input.adminId,
          note,
        },
      });

      return updatedTicket;
    },
    {
      isolationLevel: "Serializable",
    },
  );

  return getAdminSupportTicket(result.id);
}

/**
 * Closes a resolved Support Ticket and records the closing Admin.
 */
export async function closeAdminSupportTicket(
  input: CloseAdminSupportTicketInput,
) {
  await requireActiveAdmin(input.adminId);

  const note = input.note?.trim() || undefined;

  const existingTicket = await prisma.supportTicket.findUnique({
    where: {
      id: input.ticketId,
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
    return getAdminSupportTicket(input.ticketId);
  }

  if (existingTicket.status !== SupportTicketStatus.RESOLVED) {
    throw new Error("Only resolved support tickets can be closed.");
  }

  const closedAt = new Date();

  const result = await prisma.$transaction(
    async (tx) => {
      const updatedTicket = await tx.supportTicket.update({
        where: {
          id: existingTicket.id,
        },
        data: {
          status: SupportTicketStatus.CLOSED,
          closedById: input.adminId,
          closedAt,
        },
      });

      await tx.supportTicketStatusHistory.create({
        data: {
          ticketId: existingTicket.id,
          oldStatus: SupportTicketStatus.RESOLVED,
          newStatus: SupportTicketStatus.CLOSED,
          changedByAdminId: input.adminId,
          note,
        },
      });

      return updatedTicket;
    },
    {
      isolationLevel: "Serializable",
    },
  );

  return getAdminSupportTicket(result.id);
}
