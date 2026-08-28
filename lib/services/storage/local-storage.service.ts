/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author      : Prem Singh
 * Module      : Storage
 * Feature     : Local Media Storage
 * File        : lib/services/storage/local-storage.service.ts
 * Purpose     : Provides the local filesystem implementation
 *               of the provider-independent storage contract.
 * ============================================================
 */

import { promises as fs } from "fs";
import path from "path";

import type {
  StorageProvider,
  StorageUploadInput,
  StorageUploadResult,
} from "./storage.types";

const UPLOAD_ROOT = path.join(
  process.cwd(),
  "public",
  "uploads"
);

class LocalStorageService implements StorageProvider {
  private resolvePath(key: string) {
    const normalizedKey = key
      .replace(/\\/g, "/")
      .replace(/^\/+/, "");

    const resolvedPath = path.resolve(
      UPLOAD_ROOT,
      normalizedKey
    );

    const resolvedRoot = path.resolve(
      UPLOAD_ROOT
    );

    if (
      resolvedPath !== resolvedRoot &&
      !resolvedPath.startsWith(
        `${resolvedRoot}${path.sep}`
      )
    ) {
      throw new Error(
        "Invalid storage key."
      );
    }

    return resolvedPath;
  }

  async upload(
    input: StorageUploadInput
  ): Promise<StorageUploadResult> {
    const absolutePath =
      this.resolvePath(input.key);

    await fs.mkdir(
      path.dirname(absolutePath),
      {
        recursive: true,
      }
    );

    await fs.writeFile(
      absolutePath,
      input.body
    );

    return {
      key: input.key,
      url: `/uploads/${input.key}`,
      provider: "local",
    };
  }

  async delete(key: string) {
    const absolutePath =
      this.resolvePath(key);

    try {
      await fs.unlink(absolutePath);
    } catch (error) {
      const code =
        error &&
        typeof error === "object" &&
        "code" in error
          ? error.code
          : undefined;

      if (code !== "ENOENT") {
        throw error;
      }
    }
  }
}

export default new LocalStorageService();