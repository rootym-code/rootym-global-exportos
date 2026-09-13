/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : R-CAPTAIN Lead Conversion
 *
 * Module          : Inquiry Creation Service
 *
 * Description
 * ------------------------------------------------------------
 * Creates CRM inquiries from qualified R-CAPTAIN leads while
 * explicitly attributing Buyer inquiries to the originating
 * Website/Tenant.
 *
 * Responsibilities:
 * • Generate inquiry number
 * • Validate Website ownership context
 * • Map lead data to Inquiry model
 * • Create Website-scoped Prisma inquiry record
 * • Create initial sales follow-up
 *
 * ============================================================
 * Author          : Prem Singh
 * Purpose         : Prevent R-CAPTAIN Buyer leads from being
 *                   created without explicit Website scope.
 * ============================================================
 */

import {
  prisma,
} from "@/lib/prisma";

import type {
  ConversationLeadState,
} from "./conversation-state.service";

export class InquiryCreationService {

  /**
   * Generate human readable
   * inquiry number.
   */
  private generateInquiryNumber(): string {

    const timestamp =
      Date.now()
        .toString()
        .slice(-8);

    return (
      `RC-${timestamp}`
    );
  }

  /**
   * Create inquiry from a qualified R-CAPTAIN lead.
   *
   * Website ID is intentionally required at runtime.
   *
   * The R-CAPTAIN route resolves the authoritative Website
   * from the public Website slug before calling this service.
   * This service then validates that the Website is active
   * before creating the inquiry.
   */
  async createInquiry(
    lead: ConversationLeadState,
    websiteId?: string
  ) {

    if (
      !websiteId ||
      typeof websiteId !== "string" ||
      !websiteId.trim()
    ) {
      throw new Error(
        "Website context is required to create an R-CAPTAIN inquiry."
      );
    }

    const website =
      await prisma.website.findUnique({
        where: {
          id: websiteId,
        },
        select: {
          id: true,
          isActive: true,
        },
      });

    if (
      !website ||
      !website.isActive
    ) {
      throw new Error(
        "Active Website context is required to create an R-CAPTAIN inquiry."
      );
    }

    const inquiryNumber =
      this.generateInquiryNumber();

    const inquiry =
      await prisma.inquiry.create(
        {
          data:
            {
              inquiryNumber,

              /*
               * Explicit Website/Tenant attribution.
               *
               * This is the critical multi-tenant boundary for
               * Buyer-originated R-CAPTAIN inquiries.
               */
              websiteId:
                website.id,

              companyName:
                lead.companyName ?? "",

              contactPerson:
                lead.contactPerson ?? "",

              email:
                lead.email ?? "",

              phone:
                lead.phone ?? null,

              country:
                lead.country ?? "",

              product:
                lead.product ?? "",

              quantity:
                lead.quantity ?? null,

              unit:
                lead.unit ?? null,

              message:
                lead.message ??
                "Generated from R-CAPTAIN AI assistant.",

              source:
                "R-CAPTAIN",
            },
        }
      );

    const defaultAdmin =
      await prisma.admin.findFirst({
        where: {
          email: "prem@rootym.in",
          isActive: true,
        },
      });

    await prisma.followUp.create({
      data: {
        inquiryId:
          inquiry.id,

        assignedToId:
          defaultAdmin?.id ?? null,

        title:
          "Contact new R-CAPTAIN buyer",

        description:
          "Initial follow-up generated from qualified AI lead.",

        actionType:
          "WHATSAPP",

        category:
          "SALES",

        priority:
          "MEDIUM",

        status:
          "PENDING",

        scheduledAt:
          new Date(),

        estimatedMinutes:
          10,
      },
    });

    return inquiry;
  }
}
