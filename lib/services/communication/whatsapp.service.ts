/**
 * ============================================================================
 * ROOTYM GLOBAL EXPORT PLATFORM
 * ============================================================================
 * File: lib/services/communication/whatsapp.service.ts
 * Module: Communication Service
 *
 * Description:
 * Enterprise-grade service responsible for managing WhatsApp message drafts
 * and approval workflow associated with customer inquiries.
 *
 * Responsibilities:
 * - Retrieve WhatsApp messages for an inquiry
 * - Create message drafts
 * - Update drafts
 * - Delete drafts
 * - Approve drafts
 * - Reject drafts
 *
 * Design Principles:
 * - Single Responsibility Principle
 * - Thin API Route Architecture
 * - Business Logic Encapsulation
 * - Production Ready
 *
 * Author: ROOTYM Engineering
 * ============================================================================
 */

import { prisma } from "@/lib/prisma";
import { WhatsAppMessageStatus } from "@/lib/generated/prisma";

/**
 * Service responsible for WhatsApp communication workflow.
 */
export class WhatsAppService {
  /**
   * Returns all WhatsApp messages associated with an inquiry.
   *
   * @param inquiryId Inquiry identifier
   * @returns Ordered WhatsApp messages
   */
  async getMessages(inquiryId: string) {
    if (!inquiryId?.trim()) {
      throw new Error("Inquiry ID is required.");
    }

    const inquiry = await prisma.inquiry.findUnique({
      where: {
        id: inquiryId,
      },
      select: {
        id: true,
      },
    });

    if (!inquiry) {
      throw new Error("Inquiry not found.");
    }

    return prisma.whatsAppMessage.findMany({
      where: {
        inquiryId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  /**
   * Creates a new WhatsApp draft for an inquiry.
   *
   * @param inquiryId Inquiry identifier
   * @param message Draft message body
   * @returns Newly created draft
   */
  async createDraft(inquiryId: string, message: string) {
    if (!inquiryId?.trim()) {
      throw new Error("Inquiry ID is required.");
    }

    if (!message?.trim()) {
      throw new Error("Message content is required.");
    }

    const inquiry = await prisma.inquiry.findUnique({
      where: {
        id: inquiryId,
      },
      select: {
        id: true,
      },
    });

    if (!inquiry) {
      throw new Error("Inquiry not found.");
    }

    return prisma.whatsAppMessage.create({
      data: {
        inquiryId,
        message: message.trim(),
        status: WhatsAppMessageStatus.DRAFT,
      },
    });
  }

  /**
   * Updates an existing WhatsApp draft.
   *
   * @param messageId WhatsApp message identifier
   * @param message Updated message body
   * @returns Updated draft
   */



/**
 * Updates an existing WhatsApp draft.
 *
 * @param messageId WhatsApp message identifier
 * @param message Updated message body
 * @returns Updated draft
 */
async updateDraft(messageId: string, message: string) {
  if (!messageId?.trim()) {
    throw new Error("Message ID is required.");
  }

  if (!message?.trim()) {
    throw new Error("Message content is required.");
  }

  const draft = await prisma.whatsAppMessage.findUnique({
    where: {
      id: messageId,
    },
  });

  if (!draft) {
    throw new Error("WhatsApp message not found.");
  }

  // ------------------------------------------------------------------
  // TEMPORARY DEBUG LOG
  // ------------------------------------------------------------------
  console.log("========================================");
  console.log("WhatsApp Draft Debug");
  console.log("Message ID :", draft.id);
  console.log("Status     :", draft.status);
  console.log("Inquiry ID :", draft.inquiryId);
  console.log("========================================");
  // ------------------------------------------------------------------

  if (draft.status !== WhatsAppMessageStatus.DRAFT) {
    throw new Error("Only draft messages can be edited.");
  }

  return prisma.whatsAppMessage.update({
    where: {
      id: messageId,
    },
    data: {
      message: message.trim(),
    },
  });
}



  /**
   * Deletes an existing WhatsApp draft.
   *
   * @param messageId WhatsApp message identifier
   */
  async deleteDraft(messageId: string) {
    if (!messageId?.trim()) {
      throw new Error("Message ID is required.");
    }

    const draft = await prisma.whatsAppMessage.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!draft) {
      throw new Error("WhatsApp message not found.");
    }

    if (draft.status !== WhatsAppMessageStatus.DRAFT) {
      throw new Error("Only draft messages can be deleted.");
    }

    await prisma.whatsAppMessage.delete({
      where: {
        id: messageId,
      },
    });

    return {
      success: true,
    };
  }

  /**
   * Approves an existing draft.
   *
   * @param messageId WhatsApp message identifier
   * @param adminEmail Admin approving the draft
   * @returns Updated message
   */
  async approveDraft(messageId: string, adminEmail: string) {
    if (!messageId?.trim()) {
      throw new Error("Message ID is required.");
    }

    if (!adminEmail?.trim()) {
      throw new Error("Admin email is required.");
    }

    const draft = await prisma.whatsAppMessage.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!draft) {
      throw new Error("WhatsApp message not found.");
    }

    if (draft.status !== WhatsAppMessageStatus.DRAFT) {
      throw new Error("Only draft messages can be approved.");
    }

    return prisma.whatsAppMessage.update({
      where: {
        id: messageId,
      },
      data: {
        status: WhatsAppMessageStatus.APPROVED,
        approvedAt: new Date(),
        approvedBy: adminEmail.trim(),
      },
    });
  }

  /**
   * Rejects an existing draft.
   *
   * @param messageId WhatsApp message identifier
   * @returns Updated message
   */
  async rejectDraft(messageId: string) {
    if (!messageId?.trim()) {
      throw new Error("Message ID is required.");
    }

    const draft = await prisma.whatsAppMessage.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!draft) {
      throw new Error("WhatsApp message not found.");
    }

    if (draft.status !== WhatsAppMessageStatus.DRAFT) {
      throw new Error("Only draft messages can be rejected.");
    }

    return prisma.whatsAppMessage.update({
      where: {
        id: messageId,
      },
      data: {
        status: WhatsAppMessageStatus.REJECTED,
      },
    });
  }
}

const whatsappService = new WhatsAppService();

export default whatsappService;

// END OF FILE