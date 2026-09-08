/**
 * ============================================================
 * ROOTYM Customer Website Media Storage
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides tenant-safe Website media storage usage
 *          and configured storage provider status.
 * ============================================================
 */

import {
    HeadBucketCommand,
    S3Client,
  } from "@aws-sdk/client-s3";
  
  import prisma from "@/lib/prisma";
  
  export type WebsiteMediaStorageStatus =
    | "CONNECTED"
    | "NOT_CONFIGURED"
    | "CONNECTION_ERROR"
    | "NOT_CONNECTED";
  
  export interface WebsiteMediaStorageOverview {
    provider: string;
    status: WebsiteMediaStorageStatus;
  
    website: {
      mediaCount: number;
      usedBytes: number;
    };
  
    storage: {
      usedBytes: number;
      capacityBytes: number | null;
      availableBytes: number | null;
      usagePercent: number | null;
      capacityStatus:
        | "PROVIDER_MANAGED"
        | "FIXED"
        | "NOT_AVAILABLE";
    };
  
    configuration: {
      bucket: string | null;
      publicUrl: string | null;
    };
  
    checkedAt: string;
  }
  
  function getEnvironmentValue(
    name: string,
  ): string | null {
    const value = process.env[name]?.trim();
  
    return value ? value : null;
  }
  
  function getProvider(): string {
    return (
      getEnvironmentValue("STORAGE_PROVIDER")
        ?.toLowerCase() || "local"
    );
  }
  
  function getR2Client(): S3Client {
    const endpoint =
      getEnvironmentValue("R2_ENDPOINT");
  
    const accessKeyId =
      getEnvironmentValue("R2_ACCESS_KEY_ID");
  
    const secretAccessKey =
      getEnvironmentValue(
        "R2_SECRET_ACCESS_KEY",
      );
  
    if (
      !endpoint ||
      !accessKeyId ||
      !secretAccessKey
    ) {
      throw new Error(
        "R2 storage configuration is incomplete.",
      );
    }
  
    return new S3Client({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  
  async function checkR2Connection(): Promise<{
    status: WebsiteMediaStorageStatus;
    bucket: string | null;
    publicUrl: string | null;
  }> {
    const bucket =
      getEnvironmentValue("R2_BUCKET");
  
    const publicUrl =
      getEnvironmentValue("R2_PUBLIC_URL");
  
    if (!bucket) {
      return {
        status: "NOT_CONFIGURED",
        bucket: null,
        publicUrl,
      };
    }
  
    try {
      const client = getR2Client();
  
      await client.send(
        new HeadBucketCommand({
          Bucket: bucket,
        }),
      );
  
      return {
        status: "CONNECTED",
        bucket,
        publicUrl,
      };
    } catch {
      return {
        status: "CONNECTION_ERROR",
        bucket,
        publicUrl,
      };
    }
  }
  
  async function checkLocalStorageConnection(): Promise<{
    status: WebsiteMediaStorageStatus;
    bucket: null;
    publicUrl: null;
  }> {
    return {
      status: "CONNECTED",
      bucket: null,
      publicUrl: null,
    };
  }
  
  export async function getWebsiteMediaStorageOverview(
    websiteId: string,
  ): Promise<WebsiteMediaStorageOverview> {
    if (!websiteId?.trim()) {
      throw new Error(
        "Website ID is required.",
      );
    }
  
    const provider = getProvider();
  
    const aggregate =
      await prisma.media.aggregate({
        where: {
          websiteId,
          isDeleted: false,
        },
        _count: {
          _all: true,
        },
        _sum: {
          fileSize: true,
        },
      });
  
    const mediaCount =
      aggregate._count._all;
  
    const usedBytes =
      aggregate._sum.fileSize ?? 0;
  
    let connectionStatus:
      | WebsiteMediaStorageStatus;
  
    let bucket: string | null = null;
    let publicUrl: string | null = null;
  
    switch (provider) {
      case "r2": {
        const result =
          await checkR2Connection();
  
        connectionStatus =
          result.status;
  
        bucket = result.bucket;
        publicUrl = result.publicUrl;
  
        break;
      }
  
      case "local": {
        const result =
          await checkLocalStorageConnection();
  
        connectionStatus =
          result.status;
  
        break;
      }
  
      default:
        connectionStatus =
          "NOT_CONFIGURED";
    }
  
    return {
      provider,
  
      status: connectionStatus,
  
      website: {
        mediaCount,
        usedBytes,
      },
  
      storage: {
        usedBytes,
        capacityBytes: null,
        availableBytes: null,
        usagePercent: null,
        capacityStatus:
          provider === "r2"
            ? "PROVIDER_MANAGED"
            : "NOT_AVAILABLE",
      },
  
      configuration: {
        bucket,
        publicUrl,
      },
  
      checkedAt:
        new Date().toISOString(),
    };
  }
  
  export default getWebsiteMediaStorageOverview;