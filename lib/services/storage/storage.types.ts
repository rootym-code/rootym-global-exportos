/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author      : Prem Singh
 * Module      : Storage
 * Feature     : Persistent Media Storage
 * File        : lib/services/storage/storage.types.ts
 * Purpose     : Defines the provider-independent storage
 *               contracts used by the CMS media system.
 * ============================================================
 */

export interface StorageUploadInput {
    /**
     * Provider-relative storage key.
     *
     * Example:
     * products/1712345678-uuid.jpg
     */
    key: string;

    /**
     * File contents.
     */
    body: Buffer;

    /**
     * MIME type of the uploaded file.
     */
    contentType: string;
  }

  export interface StorageUploadResult {
    /**
     * Provider-relative storage key.
     */
    key: string;

    /**
     * Publicly accessible URL for the stored object.
     */
    url: string;

    /**
     * Storage provider identifier.
     */
    provider: string;
  }

  export interface StorageProvider {
    upload(
      input: StorageUploadInput
    ): Promise<StorageUploadResult>;

    delete(key: string): Promise<void>;
  }
