/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated customer workspace
 *          context and Website-scoped Media Library data
 *          without exposing globally scoped media records.
 * ============================================================
 */

import prisma from "@/lib/prisma";

import { requireWorkspaceAccess } from "../require-workspace-access";

export type WebsiteMediaStatus =
  | "PREPARING"
  | "READY"
  | "NOT_CONNECTED";

export interface WebsiteMediaOverview {
  workspace: {
    id: string;
    name: string;
    slug: string;
  };

  owner: {
    id: string;
    name: string;
    email: string;
  };

  subscription: {
    id: string | null;
    status: string | null;
    planName: string | null;
    billingInterval: string | null;
  };

  media: {
    status: WebsiteMediaStatus;
    storageStatus: WebsiteMediaStatus;
    libraryStatus: WebsiteMediaStatus;
  };

  contentSummary: {
    total: number;
    images: number;
    videos: number;
    documents: number;
    audio: number;
    other: number;
  };
}

/**
 * Returns the Media Library context for the
 * currently authenticated customer workspace.
 *
 * Tenant identity is derived exclusively from the
 * authenticated customer session.
 *
 * Media records are strictly scoped through the
 * tenant-owned Website.id.
 *
 * Existing global Media records with websiteId = null
 * are intentionally excluded.
 */
export async function getWebsiteMediaOverview(): Promise<WebsiteMediaOverview> {
  const { user, tenant } = await requireWorkspaceAccess();

  const currentSubscription = tenant.subscriptions[0] ?? null;

  const website = await prisma.website.findUnique({
    where: {
      tenantId: tenant.id,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      isActive: true,
    },
  });

  const websiteConnected = Boolean(website?.isActive);

  const mediaTypeCounts = website
  ? await prisma.media.groupBy({
      by: ["mediaType"],
      where: {
        websiteId: website.id,
        isDeleted: false,
      },
      _count: {
        _all: true,
      },
    })
  : [];

  const total = mediaTypeCounts.reduce(
    (count, item) => count + item._count._all,
    0,
  );

  const images =
    mediaTypeCounts.find((item) => item.mediaType === "IMAGE")?._count
      ._all ?? 0;

  const videos =
    mediaTypeCounts.find((item) => item.mediaType === "VIDEO")?._count
      ._all ?? 0;

  const documents =
    mediaTypeCounts.find((item) => item.mediaType === "DOCUMENT")?._count
      ._all ?? 0;

  const audio =
    mediaTypeCounts.find((item) => item.mediaType === "AUDIO")?._count
      ._all ?? 0;

  const other =
    mediaTypeCounts.find((item) => item.mediaType === "OTHER")?._count
      ._all ?? 0;

  return {
    workspace: {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
    },

    owner: {
      id: user.id,
      name: user.name,
      email: user.email,
    },

    subscription: {
      id: currentSubscription?.id ?? null,
      status: currentSubscription?.status ?? null,
      planName: currentSubscription?.plan?.name ?? null,
      billingInterval: currentSubscription?.billingInterval ?? null,
    },

    media: {
      status: websiteConnected ? "READY" : "NOT_CONNECTED",
      storageStatus: websiteConnected ? "READY" : "NOT_CONNECTED",
      libraryStatus: websiteConnected ? "READY" : "NOT_CONNECTED",
    },

    contentSummary: {
      total,
      images,
      videos,
      documents,
      audio,
      other,
    },
  };
}

export default getWebsiteMediaOverview;