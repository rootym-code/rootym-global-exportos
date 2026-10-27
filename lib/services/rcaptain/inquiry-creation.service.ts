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
export interface RCaptainQuotationProduct {
  productId: string;
  quantity?: string;
  unit?: string;
}
export class InquiryCreationService {

  /**
   * Generate human readable
   * inquiry number.
   */
  private generateInquiryNumber(): string {
    const timestamp = Date.now();
    const randomSuffix = crypto.randomUUID()
      .replace(/-/g, "")
      .slice(0, 8)
      .toUpperCase();
      return `RC-${timestamp}-${randomSuffix}`;
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
    /**
   * Create an explicit multi-product buyer quotation request.
   *
   * Existing chat-based createInquiry() remains unchanged.
   * The submission key makes retries idempotent.
   */
  async createQuotationRequest(
    lead: ConversationLeadState,
    websiteId: string,
    submissionKey: string,
    selectedProducts: RCaptainQuotationProduct[],
  ) {
    if (!websiteId?.trim()) {
      throw new Error("Website context is required.");
    }

    if (
      !submissionKey?.trim() ||
      submissionKey.length > 200
    ) {
      throw new Error("A valid submission key is required.");
    }

    if (
      !Array.isArray(selectedProducts) ||
      selectedProducts.length < 1 ||
      selectedProducts.length > 10
    ) {
      throw new Error(
        "Select between 1 and 10 products.",
      );
    }

    if (
      !lead.companyName?.trim() ||
      !lead.contactPerson?.trim() ||
      !lead.email?.trim() ||
      !lead.country?.trim()
    ) {
      throw new Error(
        "Company, contact person, email, and country are required.",
      );
    }

    const normalize = (
      value?: string | null,
    ): string | null => value?.trim() || null;

    const productIds = selectedProducts.map(
      (item) => item.productId,
    );

    if (
      productIds.some(
        (id) => typeof id !== "string" || !id.trim(),
      ) ||
      new Set(productIds).size !== productIds.length
    ) {
      throw new Error(
        "Product selections must have valid, unique IDs.",
      );
    }

    const requestedProducts = selectedProducts.map(
      (item) => ({
        productId: item.productId,
        quantity: normalize(
          item.quantity ??
            (selectedProducts.length === 1
              ? lead.quantity
              : undefined),
        ),
        unit: normalize(
          item.unit ??
            (selectedProducts.length === 1
              ? lead.unit
              : undefined),
        ),
      }),
    );

    const requestMessage =
      lead.message?.trim() ||
      "Buyer quotation request submitted through R-CAPTAIN.";

    const companyName = lead.companyName.trim();
    const contactPerson = lead.contactPerson.trim();
    const email = lead.email.trim();
    const phone = normalize(lead.phone);
    const country = lead.country.trim();

    const matchesExistingRequest = (
      existing: {
        websiteId: string | null;
        companyName: string;
        contactPerson: string;
        email: string;
        phone: string | null;
        country: string;
        message: string;
        requestedProducts: {
          productId: string;
          quantity: string | null;
          unit: string | null;
        }[];
      },
    ) => {
      const existingProducts =
        existing.requestedProducts
          .map((item) => ({
            productId: item.productId,
            quantity: normalize(item.quantity),
            unit: normalize(item.unit),
          }))
          .sort((a, b) =>
            a.productId.localeCompare(b.productId),
          );

      const incomingProducts = [...requestedProducts]
        .sort((a, b) =>
          a.productId.localeCompare(b.productId),
        );

      return (
        existing.websiteId === websiteId &&
        existing.companyName === companyName &&
        existing.contactPerson === contactPerson &&
        existing.email === email &&
        existing.phone === phone &&
        existing.country === country &&
        existing.message === requestMessage &&
        JSON.stringify(existingProducts) ===
          JSON.stringify(incomingProducts)
      );
    };

    const findExistingRequest = () =>
      prisma.inquiry.findUnique({
        where: { submissionKey },
        include: {
          requestedProducts: {
            select: {
              productId: true,
              quantity: true,
              unit: true,
            },
          },
        },
      });

    // Fast path for retries after a successful submission.
    const existing = await findExistingRequest();

    if (existing) {
      if (!matchesExistingRequest(existing)) {
        throw new Error(
          "This submission key has already been used for a different request.",
        );
      }

      return existing;
    }

    try {
      return await prisma.$transaction(async (tx) => {
        const website = await tx.website.findUnique({
          where: { id: websiteId },
          select: {
            id: true,
            isActive: true,
          },
        });

        if (!website || !website.isActive) {
          throw new Error(
            "Active Website context is required.",
          );
        }

        const products = await tx.product.findMany({
          where: {
            id: { in: productIds },
            websiteId: website.id,
            status: "PUBLISHED",
          },
          select: {
            id: true,
            name: true,
          },
        });

        if (products.length !== productIds.length) {
          throw new Error(
            "One or more selected products are unavailable for this website.",
          );
        }

        const productNames = new Map(
          products.map((product) => [
            product.id,
            product.name,
          ]),
        );

        const inquiry = await tx.inquiry.create({
          data: {
            inquiryNumber: this.generateInquiryNumber(),
            submissionKey,
            websiteId: website.id,
            companyName,
            contactPerson,
            email,
            phone,
            country,
            product: requestedProducts
              .map((item) => productNames.get(item.productId)!)
              .join(", "),
            quantity:
              requestedProducts.length === 1
                ? requestedProducts[0].quantity
                : null,
            unit:
              requestedProducts.length === 1
                ? requestedProducts[0].unit
                : null,
            message: requestMessage,
            source: "R-CAPTAIN",
            requestedProducts: {
              create: requestedProducts.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unit: item.unit,
              })),
            },
          },
          include: {
            requestedProducts: {
              select: {
                productId: true,
                quantity: true,
                unit: true,
              },
            },
          },
        });

        const defaultAdmin =
          await tx.admin.findFirst({
            where: {
              email: "prem@rootym.in",
              isActive: true,
            },
            select: { id: true },
          });

        await tx.followUp.create({
          data: {
            inquiryId: inquiry.id,
            assignedToId: defaultAdmin?.id ?? null,
            title: "Contact new R-CAPTAIN buyer",
            description:
              "Initial follow-up for a multi-product quotation request.",
            actionType: "WHATSAPP",
            category: "SALES",
            priority: "MEDIUM",
            status: "PENDING",
            scheduledAt: new Date(),
            estimatedMinutes: 10,
          },
        });

        return inquiry;
      });
    } catch (error: unknown) {
      // A concurrent request may have won the unique-key race.
      const isUniqueViolation =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "P2002";

      if (isUniqueViolation) {
        const racedRequest = await findExistingRequest();

        if (racedRequest) {
          if (!matchesExistingRequest(racedRequest)) {
            throw new Error(
              "This submission key has already been used for a different request.",
            );
          }

          return racedRequest;
        }
      }

      throw error;
    }
  }
}
