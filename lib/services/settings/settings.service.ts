/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : CMS Settings
 * Feature         : Settings Service
 *
 * Description
 * ------------------------------------------------------------
 * Central service for reading and saving CMS settings.
 * All setting categories (Company, Google, WhatsApp, SEO, etc.)
 * should use this service.
 * ============================================================
 */

import { prisma } from "@/lib/prisma";

export interface SaveSettingInput {
  key: string;
  value: string;
}

export class SettingsService {
  /**
   * Get setting value by key.
   */
  static async getValue(key: string): Promise<string> {
    const setting = await prisma.siteSetting.findUnique({
      where: { key },
    });

    return setting?.value ?? "";
  }

  /**
   * Get multiple settings.
   */
  static async getValues(
    keys: readonly string[]
  ): Promise<Record<string, string>> {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: [...keys],
        },
      },
    });

    return settings.reduce<Record<string, string>>((result, item) => {
      result[item.key] = item.value ?? "";
      return result;
    }, {});
  }

  /**
   * Save multiple settings.
   */
  static async saveValues(
    settings: SaveSettingInput[]
  ): Promise<void> {
    await prisma.$transaction(
      settings.map((setting) =>
        prisma.siteSetting.upsert({
          where: {
            key: setting.key,
          },
          create: {
            key: setting.key,
            value: setting.value,
          },
          update: {
            value: setting.value,
          },
        })
      )
    );
  }
}