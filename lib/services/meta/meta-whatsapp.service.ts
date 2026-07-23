/**
 * ============================================================================
 * ROOTYM GLOBAL EXPORT PLATFORM
 * ============================================================================
 * File: lib/services/meta/meta-whatsapp.service.ts
 * Module: Meta WhatsApp Cloud API
 *
 * Description:
 * Service responsible for sending WhatsApp messages using
 * Meta WhatsApp Cloud API.
 *
 * Responsibilities:
 * - Send text messages
 * - Return Meta Message ID
 * - Throw meaningful errors
 *
 * Design Principles:
 * - Single Responsibility Principle
 * - Production Ready
 * ============================================================================
 */

import metaClient from "@/lib/services/meta/meta.client";
import metaConfig from "@/lib/config/meta";

export interface SendTextMessageRequest {
  to: string;
  message: string;
}

export interface SendTextMessageResponse {
  messaging_product: string;
  contacts: {
    input: string;
    wa_id: string;
  }[];
  messages: {
    id: string;
  }[];
}

class MetaWhatsAppService {
  /**
   * Sends a plain text WhatsApp message.
   */
  async sendTextMessage({
    to,
    message,
  }: SendTextMessageRequest): Promise<string> {
    const phone = to.replace(/\D/g, "");

    const response =
      await metaClient.post<SendTextMessageResponse>(
        `/${metaConfig.phoneNumberId}/messages`,
        {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: phone,
          type: "text",
          text: {
            preview_url: false,
            body: message,
          },
        }
      );

    const messageId = response.messages?.[0]?.id;

    if (!messageId) {
      throw new Error(
        "Meta did not return a WhatsApp message ID."
      );
    }

    return messageId;
  }
}

const metaWhatsAppService =
  new MetaWhatsAppService();

export default metaWhatsAppService;