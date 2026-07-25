import { DEFAULT_WHATSAPP_SETTINGS } from "./constants";
import type {
  WhatsAppSettings,
  WhatsAppSettingsResponse,
} from "./types";

const API_ENDPOINT =
  "/api/admin/cms/settings/whatsapp";

/* ============================================================
   Get WhatsApp Settings
============================================================ */

export async function getWhatsAppSettings(): Promise<WhatsAppSettings> {
  const response = await fetch(API_ENDPOINT, {
    cache: "no-store",
  });

  if (!response.ok) {
    return DEFAULT_WHATSAPP_SETTINGS;
  }

  const result: WhatsAppSettingsResponse =
    await response.json();

  return {
    ...DEFAULT_WHATSAPP_SETTINGS,
    ...result.data,
  };
}

/* ============================================================
   Save WhatsApp Settings
============================================================ */

export async function saveWhatsAppSettings(
  settings: WhatsAppSettings
): Promise<WhatsAppSettings> {
  const response = await fetch(API_ENDPOINT, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error(
      "Unable to save WhatsApp settings."
    );
  }

  const result: WhatsAppSettingsResponse =
    await response.json();

  return {
    ...DEFAULT_WHATSAPP_SETTINGS,
    ...result.data,
  };
}