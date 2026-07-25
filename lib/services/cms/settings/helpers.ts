/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : CMS Settings
 * Feature         : Shared Helper Functions
 *
 * Description
 * ------------------------------------------------------------
 * Shared helper methods for reading and saving Site Settings.
 * Used by Company, Google, WhatsApp, SEO and future modules.
 * ============================================================
 */

import prisma from "@/lib/prisma";

import { SiteSettingUpsertInput } from "./types";

/**
 * Load multiple settings into a lookup map.
 */
export async function getSettingsByKeys(
  keys: readonly string[]
): Promise<Map<string, string>> {
  const settings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [...keys],
      },
    },
  });

  return new Map(
    settings.map((setting) => [
      setting.key,
      setting.value ?? "",
    ])
  );
}

/**
 * Save multiple settings using upsert.
 */
export async function saveSettings(
  settings: SiteSettingUpsertInput[]
): Promise<void> {
  await prisma.$transaction(
    settings.map((setting) =>
      prisma.siteSetting.upsert({
        where: {
          key: setting.key,
        },
        update: {
          value: setting.value,
          category: setting.category,
          description: setting.description,
          valueType: setting.valueType,
          isPublic: setting.isPublic,
        },
        create: setting,
      })
    )
  );
}