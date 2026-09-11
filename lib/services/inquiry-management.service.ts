/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides shared Website-scoped Inquiry management
 *          operations for Admin and Customer Workspace.
 *
 * Architecture:
 * - Admin and Customer Workspace use separate authentication.
 * - Both operate on the same Inquiry database records.
 * - Website ownership is enforced by every management operation.
 * - This service does NOT replace inquiry.service.ts, which owns
 *   public/R-CAPTAIN Inquiry creation and its FollowUp workflow.
 * ============================================================
 */

import prisma from "@/lib/prisma";

import type {
  InquiryPriority,
  InquiryStatus,
  SalesStage,
  Prisma,
} from "@/lib/generated/prisma";

/**
 * ============================================================
 * Inquiry list filters
 * ============================================================
 */
export interface InquiryListFilters {
  search?: string;
  status?: InquiryStatus;
  priority?: InquiryPriority;
  salesStage?: SalesStage;
  country?: string;
  page?: number;
  pageSize?: number;
}

/**
 * ============================================================
 * Inquiry update input
 *
 * Only fields that are appropriate for Inquiry management are
 * exposed here. Website ownership is deliberately NOT part of
 * this input.
 * ============================================================
 */
export interface InquiryManagementUpdateInput {
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string | null;
  country?: string;
  product?: string;
  quantity?: string | null;
  unit?: string | null;
  message?: string;
  status?: InquiryStatus;
  priority?: InquiryPriority;
  source?: string | null;
  salesStage?: SalesStage;
}

/**
 * ============================================================
 * Shared Inquiry include shape
 *
 * Keep the related records available to Admin and Workspace so
 * both surfaces can work from the same underlying Inquiry.
 *
 * IMPORTANT:
 * Quote-level relations are not loaded by `quotes: true`.
 * The Proforma Invoice is therefore explicitly included under
 * each Quote so Workspace Inquiry detail can immediately reflect
 * an existing Proforma Invoice after the page is reloaded.
 * ============================================================
 */
const inquiryInclude = {
  linkedProduct: true,
  website: true,
  followUps: true,
  notes: true,
  statusHistory: true,
  quotes: {
    include: {
      proformaInvoice: true,
    },
  },
  whatsappMessages: true,
} satisfies Prisma.InquiryInclude;

/**
 * ============================================================
 * Internal Website ownership guard
 *
 * Every management operation must pass through this check.
 * The Inquiry must belong to the supplied Website.
 * ============================================================
 */
async function getWebsiteInquiry(
  websiteId: string,
  inquiryId: string,
) {
  if (!websiteId) {
    throw new Error("Website ID is required.");
  }

  if (!inquiryId) {
    throw new Error("Inquiry ID is required.");
  }

  const inquiry = await prisma.inquiry.findFirst({
    where: {
      id: inquiryId,
      websiteId,
    },
    include: inquiryInclude,
  });

  if (!inquiry) {
    throw new Error("Inquiry not found.");
  }

  return inquiry;
}

/**
 * ============================================================
 * List Website inquiries
 * ============================================================
 */
export async function listInquiries(
  websiteId: string,
  filters: InquiryListFilters = {},
) {
  if (!websiteId) {
    throw new Error("Website ID is required.");
  }

  const page = Math.max(1, filters.page ?? 1);

  const pageSize = Math.min(
    100,
    Math.max(1, filters.pageSize ?? 20),
  );

  const search = filters.search?.trim();

  const where: Prisma.InquiryWhereInput = {
    websiteId,

    ...(filters.status
      ? {
          status: filters.status,
        }
      : {}),

    ...(filters.priority
      ? {
          priority: filters.priority,
        }
      : {}),

    ...(filters.salesStage
      ? {
          salesStage: filters.salesStage,
        }
      : {}),

    ...(filters.country?.trim()
      ? {
          country: {
            contains: filters.country.trim(),
            mode: "insensitive",
          },
        }
      : {}),

    ...(search
      ? {
          OR: [
            {
              inquiryNumber: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              companyName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              contactPerson: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              country: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              product: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  };

  const [total, inquiries] = await prisma.$transaction([
    prisma.inquiry.count({
      where,
    }),

    prisma.inquiry.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: inquiryInclude,
    }),
  ]);

  return {
    inquiries,

    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

/**
 * ============================================================
 * Get one Website Inquiry
 * ============================================================
 */
export async function getInquiryById(
  websiteId: string,
  inquiryId: string,
) {
  return getWebsiteInquiry(
    websiteId,
    inquiryId,
  );
}

/**
 * ============================================================
 * Update Website Inquiry
 *
 * The existing Inquiry record is updated directly. No duplicate
 * Workspace Inquiry record is created.
 *
 * Status changes also create the existing InquiryStatusHistory
 * record. The current schema supports an Admin actor only, so
 * changedByAdminId is optional and Workspace updates leave the
 * actor field null until the schema supports User actors.
 * ============================================================
 */
export async function updateInquiry(
  websiteId: string,
  inquiryId: string,
  data: InquiryManagementUpdateInput,
  changedByAdminId?: string | null,
) {
  const existing = await getWebsiteInquiry(
    websiteId,
    inquiryId,
  );

  const updateData: Prisma.InquiryUpdateInput = {};

  if (data.companyName !== undefined) {
    updateData.companyName = data.companyName;
  }

  if (data.contactPerson !== undefined) {
    updateData.contactPerson = data.contactPerson;
  }

  if (data.email !== undefined) {
    updateData.email = data.email;
  }

  if (data.phone !== undefined) {
    updateData.phone = data.phone;
  }

  if (data.country !== undefined) {
    updateData.country = data.country;
  }

  if (data.product !== undefined) {
    updateData.product = data.product;
  }

  if (data.quantity !== undefined) {
    updateData.quantity = data.quantity;
  }

  if (data.unit !== undefined) {
    updateData.unit = data.unit;
  }

  if (data.message !== undefined) {
    updateData.message = data.message;
  }

  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  if (data.priority !== undefined) {
    updateData.priority = data.priority;
  }

  if (data.source !== undefined) {
    updateData.source = data.source;
  }

  if (data.salesStage !== undefined) {
    updateData.salesStage = data.salesStage;
  }

  const statusChanged =
    data.status !== undefined &&
    data.status !== existing.status;

  const updatedInquiry = await prisma.$transaction(
    async (tx) => {
      const inquiry = await tx.inquiry.update({
        where: {
          id: existing.id,
        },
        data: updateData,
        include: inquiryInclude,
      });

      if (statusChanged) {
        await tx.inquiryStatusHistory.create({
          data: {
            inquiryId: existing.id,
            oldStatus: existing.status,
            newStatus: data.status!,
            changedById:
              changedByAdminId ?? null,
          },
        });
      }

      return inquiry;
    },
  );

  return updatedInquiry;
}

/**
 * ============================================================
 * Delete Website Inquiry
 *
 * This operation is intentionally exposed here so Admin and
 * Workspace can share the same Website ownership boundary.
 *
 * Related records follow the existing Prisma relation rules.
 * ============================================================
 */
export async function deleteInquiry(
  websiteId: string,
  inquiryId: string,
) {
  const existing = await getWebsiteInquiry(
    websiteId,
    inquiryId,
  );

  return prisma.inquiry.delete({
    where: {
      id: existing.id,
    },
  });
}

export default {
  listInquiries,
  getInquiryById,
  updateInquiry,
  deleteInquiry,
};
