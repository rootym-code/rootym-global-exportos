/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Creates customer inquiries while preserving the
 *          existing FollowUp workflow and validating optional
 *          Website/Product relationships.
 * ============================================================
 */

import prisma from "@/lib/prisma";
import { generateInquiryNumber } from "@/lib/utils/inquiry-number";
import type { InquiryInput } from "@/lib/validations/inquiry";

export interface CreateInquiryMetadata {
  ipAddress?: string;
  userAgent?: string;
}

export async function createInquiry(
  data: InquiryInput,
  metadata: CreateInquiryMetadata,
) {
  return await prisma.$transaction(async (tx) => {
    /**
     * --------------------------------------------------------
     * Optional Website / Product validation
     * --------------------------------------------------------
     *
     * Legacy inquiries may not have a Website or Product
     * master reference, so these relationships remain optional.
     *
     * When productId is supplied:
     * 1. Product must exist.
     * 2. If websiteId is supplied, Product must belong to it.
     * 3. The Product's actual Website is used for persistence.
     */
    let resolvedWebsiteId: string | null =
      data.websiteId ?? null;

    let resolvedProductId: string | null =
      data.productId ?? null;

    if (data.productId) {
      const product = await tx.product.findUnique({
        where: {
          id: data.productId,
        },
        select: {
          id: true,
          name: true,
          websiteId: true,
        },
      });

      if (!product) {
        throw new Error(
          "The selected product could not be found.",
        );
      }

      if (
        data.websiteId &&
        product.websiteId !== data.websiteId
      ) {
        throw new Error(
          "The selected product does not belong to the selected website.",
        );
      }

      /**
       * Always derive the persisted Website from the Product
       * relationship once a Product master record is supplied.
       */
      resolvedWebsiteId = product.websiteId;

      /**
       * Preserve the Product master reference and use the
       * Product master name as the historical text snapshot.
       */
      resolvedProductId = product.id;
    }

    /**
     * Temporary unique value required by the current schema
     * before the final human-readable Inquiry number is known.
     */
    const placeholderInquiryNumber =
      crypto.randomUUID();

    const inquiry = await tx.inquiry.create({
      data: {
        inquiryNumber: placeholderInquiryNumber,

        companyName: data.companyName,
        contactPerson: data.contactPerson,

        email: data.email,
        phone: data.phone || null,

        country: data.country,

        /**
         * Preserve the existing product text field as the
         * historical/display snapshot.
         */
        product: data.product,

        /**
         * New Website/Product relationships.
         *
         * Legacy/global inquiries continue to store null.
         */
        ...(resolvedWebsiteId
          ? {
              website: {
                connect: {
                  id: resolvedWebsiteId,
                },
              },
            }
          : {}),

        ...(resolvedProductId
          ? {
              linkedProduct: {
                connect: {
                  id: resolvedProductId,
                },
              },
            }
          : {}),

        quantity: data.quantity || null,
        unit: data.unit || null,

        message: data.message,

        ipAddress: metadata.ipAddress ?? null,
        userAgent: metadata.userAgent ?? null,
      },
    });

    const inquiryNumber = generateInquiryNumber(
      inquiry.id,
    );

    const updatedInquiry = await tx.inquiry.update({
      where: {
        id: inquiry.id,
      },
      data: {
        inquiryNumber,
      },
    });

    /**
     * --------------------------------------------------------
     * Existing automatic FollowUp workflow
     * --------------------------------------------------------
     *
     * DO NOT remove or change this workflow.
     */
    const defaultAdmin = await tx.admin.findFirst({
      where: {
        email: "prem@rootym.in",
        isActive: true,
      },
    });

    await tx.followUp.create({
      data: {
        inquiryId: inquiry.id,
        assignedToId: defaultAdmin?.id ?? null,

        title: "Contact new buyer inquiry",

        description:
          "Initial follow-up for new export inquiry.",

        actionType: "WHATSAPP",

        category: "SALES",

        priority: "MEDIUM",

        status: "PENDING",

        scheduledAt: new Date(),

        estimatedMinutes: 10,
      },
    });

    return updatedInquiry;
  });
}