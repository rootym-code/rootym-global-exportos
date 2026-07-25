import { DEFAULT_GOOGLE_SETTINGS } from "./constants";
import type {
  GoogleSettings,
  GoogleSettingsResponse,
} from "./types";

const API_ENDPOINT =
  "/api/admin/cms/settings/google";

/* ============================================================
   Get Google Settings
============================================================ */

export async function getGoogleSettings(): Promise<GoogleSettings> {
  const response = await fetch(API_ENDPOINT, {
    cache: "no-store",
  });

  if (!response.ok) {
    return DEFAULT_GOOGLE_SETTINGS;
  }

  const result: GoogleSettingsResponse =
    await response.json();

  return {
    ...DEFAULT_GOOGLE_SETTINGS,
    ...result.data,
  };
}

/* ============================================================
   Save Google Settings
============================================================ */

export async function saveGoogleSettings(
  settings: GoogleSettings
): Promise<GoogleSettings> {
  const response = await fetch(API_ENDPOINT, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error(
      "Unable to save Google settings."
    );
  }

  const result: GoogleSettingsResponse =
    await response.json();

  return {
    ...DEFAULT_GOOGLE_SETTINGS,
    ...result.data,
  };
}