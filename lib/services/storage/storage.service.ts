/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author      : Prem Singh
 * Module      : Storage
 * Feature     : Storage Provider Factory
 * File        : lib/services/storage/storage.service.ts
 * Purpose     : Selects the configured persistent media storage
 *               provider without coupling CMS code to storage.
 * ============================================================
 */

import type { StorageProvider } from "./storage.types";

import localStorageService from "./local-storage.service";
import r2StorageService from "./r2-storage.service";

function getStorageProvider(): StorageProvider {
  const provider =
    process.env.STORAGE_PROVIDER
      ?.trim()
      .toLowerCase() || "local";

  switch (provider) {
    case "local":
      return localStorageService;

    case "r2":
      return r2StorageService;

    default:
      throw new Error(
        `Unsupported storage provider: ${provider}`
      );
  }
}

export default getStorageProvider;