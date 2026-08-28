/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author      : Prem Singh
 * Module      : Storage
 * Feature     : Cloudflare R2 Media Storage
 * File        : lib/services/storage/r2-storage.service.ts
 * Purpose     : Provides the Cloudflare R2 implementation
 *               using the S3-compatible API.
 * ============================================================
 */

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import type {
  StorageProvider,
  StorageUploadInput,
  StorageUploadResult,
} from "./storage.types";

function getRequiredEnvironmentVariable(
  name: string
): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required storage environment variable: ${name}`
    );
  }

  return value;
}

function getR2Client(): S3Client {
  const endpoint =
    getRequiredEnvironmentVariable(
      "R2_ENDPOINT"
    );

  const accessKeyId =
    getRequiredEnvironmentVariable(
      "R2_ACCESS_KEY_ID"
    );

  const secretAccessKey =
    getRequiredEnvironmentVariable(
      "R2_SECRET_ACCESS_KEY"
    );

  return new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

class R2StorageService
  implements StorageProvider
{
  private getBucketName(): string {
    return getRequiredEnvironmentVariable(
      "R2_BUCKET"
    );
  }

  private getPublicUrl(): string {
    return getRequiredEnvironmentVariable(
      "R2_PUBLIC_URL"
    ).replace(/\/+$/, "");
  }

  async upload(
    input: StorageUploadInput
  ): Promise<StorageUploadResult> {
    const client = getR2Client();

    const key = input.key.replace(
      /^\/+/,
      ""
    );

    await client.send(
      new PutObjectCommand({
        Bucket: this.getBucketName(),
        Key: key,
        Body: input.body,
        ContentType: input.contentType,
      })
    );

    return {
      key,
      url: `${this.getPublicUrl()}/${key}`,
      provider: "r2",
    };
  }

  async delete(
    key: string
  ): Promise<void> {
    const client = getR2Client();

    await client.send(
      new DeleteObjectCommand({
        Bucket: this.getBucketName(),
        Key: key.replace(/^\/+/, ""),
      })
    );
  }
}

export default new R2StorageService();