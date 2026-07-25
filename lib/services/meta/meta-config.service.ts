/**
 * ============================================================================
 * ROOTYM GLOBAL EXPORT PLATFORM
 * ============================================================================
 * File: lib/services/meta/meta-config.service.ts
 * Module: Meta Configuration Service
 *
 * Description:
 * Provides Meta WhatsApp Cloud API configuration from CMS settings.
 *
 * Responsibilities:
 * - Load Meta configuration
 * - Validate required settings
 * - Expose configuration to Meta services
 *
 * Design Principles:
 * - Single Responsibility Principle
 * - Centralized Configuration
 * - Production Ready
 * ============================================================================
 */

import prisma from "@/lib/prisma";

import {
  WHATSAPP_SETTING_KEY,
} from "@/lib/constants/site-settings/whatsapp";

export interface MetaConfiguration {
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  metaAppId: string;
  metaAppSecret: string;
  verifyToken: string;
}

class MetaConfigService {
  async getConfiguration(): Promise<MetaConfiguration> {
    const settings =
      await prisma.siteSetting.findMany({
        where: {
          key: {
            in: [
              WHATSAPP_SETTING_KEY.ACCESS_TOKEN,
              WHATSAPP_SETTING_KEY.PHONE_NUMBER_ID,
              WHATSAPP_SETTING_KEY.BUSINESS_ACCOUNT_ID,
              WHATSAPP_SETTING_KEY.META_APP_ID,
              WHATSAPP_SETTING_KEY.META_APP_SECRET,
              WHATSAPP_SETTING_KEY.VERIFY_TOKEN,
            ],
          },
        },
      });

    const map = new Map(
      settings.map((item) => [
        item.key,
        item.value,
      ])
    );

    const config: MetaConfiguration = {
      accessToken:
        map.get(
          WHATSAPP_SETTING_KEY.ACCESS_TOKEN
        ) ?? "",

      phoneNumberId:
        map.get(
          WHATSAPP_SETTING_KEY.PHONE_NUMBER_ID
        ) ?? "",

      businessAccountId:
        map.get(
          WHATSAPP_SETTING_KEY.BUSINESS_ACCOUNT_ID
        ) ?? "",

      metaAppId:
        map.get(
          WHATSAPP_SETTING_KEY.META_APP_ID
        ) ?? "",

      metaAppSecret:
        map.get(
          WHATSAPP_SETTING_KEY.META_APP_SECRET
        ) ?? "",

      verifyToken:
        map.get(
          WHATSAPP_SETTING_KEY.VERIFY_TOKEN
        ) ?? "",
    };

    if (!config.accessToken) {
      throw new Error(
        "Meta Access Token is not configured."
      );
    }

    if (!config.phoneNumberId) {
      throw new Error(
        "Meta Phone Number ID is not configured."
      );
    }

    return config;
  }
}

const metaConfigService =
  new MetaConfigService();

export default metaConfigService;