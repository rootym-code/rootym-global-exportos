/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides Website-scoped Media Library retrieval,
 *          pagination, filtering, searching and folder listing
 *          for the authenticated customer Website.
 * ============================================================
 */

import { Prisma, MediaType } from "@/lib/generated/prisma";

import prisma from "@/lib/prisma";

import BaseCmsService, {
  PaginationOptions,
} from "@/lib/services/cms/base.service";

export interface WebsiteMediaListFilters {
  mediaType?: MediaType;
  folder?: string;
  includeDeleted?: boolean;
  search?: string;
}

export interface WebsiteMediaFolder {
  folder: string;
  count: number;
}

class WebsiteMediaLibraryService extends BaseCmsService {
  /**
   * Lists Media records belonging exclusively to the
   * specified Website.
   *
   * Global Media records with websiteId = null and Media
   * belonging to other Websites are never returned.
   */
  async list(
    websiteId: string,
    filters?: WebsiteMediaListFilters,
    pagination?: PaginationOptions,
  ) {
    return this.execute(async () => {
      const normalizedWebsiteId = websiteId.trim();

      if (!normalizedWebsiteId) {
        throw new Error("Website ID is required.");
      }

      const { skip, take } = this.getPagination(
        pagination,
      );

      const search = this.normalizeSearch(
        filters?.search,
      );

      const where: Prisma.MediaWhereInput = {
        websiteId: normalizedWebsiteId,
      };

      if (filters?.mediaType) {
        where.mediaType = filters.mediaType;
      }

      if (filters?.folder) {
        where.folder = filters.folder;
      }

      if (!filters?.includeDeleted) {
        where.isDeleted = false;
      }

      if (search) {
        where.OR = [
          {
            fileName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            altText: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: search,
              mode: "insensitive",
            },
          },
        ];
      }

      return this.paginate(
        () =>
          prisma.media.findMany({
            where,
            skip,
            take,
            orderBy: {
              createdAt: "desc",
            },
          }),
        () =>
          prisma.media.count({
            where,
          }),
        pagination,
      );
    });
  }

  /**
   * Retrieves one Media record belonging exclusively
   * to the specified Website.
   */
  async getById(
    websiteId: string,
    mediaId: string,
  ) {
    return this.execute(async () => {
      const normalizedWebsiteId =
        websiteId.trim();

      const normalizedMediaId =
        mediaId.trim();

      if (!normalizedWebsiteId) {
        throw new Error("Website ID is required.");
      }

      if (!normalizedMediaId) {
        throw new Error("Media ID is required.");
      }

      const media =
        await prisma.media.findFirst({
          where: {
            id: normalizedMediaId,
            websiteId: normalizedWebsiteId,
          },
        });

      return this.ensureExists(
        media,
        "Media not found.",
      );
    });
  }

  /**
   * Returns folders belonging exclusively to the
   * specified Website.
   *
   * Deleted Media is excluded so folders shown in the
   * active Media Library represent currently available
   * content.
   */
  async getFolders(
    websiteId: string,
  ): Promise<WebsiteMediaFolder[]> {
    return this.execute(async () => {
      const normalizedWebsiteId =
        websiteId.trim();

      if (!normalizedWebsiteId) {
        throw new Error("Website ID is required.");
      }

      const media =
        await prisma.media.findMany({
          where: {
            websiteId: normalizedWebsiteId,
            isDeleted: false,
            folder: {
              not: null,
            },
          },
          select: {
            folder: true,
          },
          orderBy: {
            folder: "asc",
          },
        });

      const folderCounts =
        new Map<string, number>();

      for (const item of media) {
        const folder = item.folder?.trim();

        if (!folder) {
          continue;
        }

        folderCounts.set(
          folder,
          (folderCounts.get(folder) ?? 0) + 1,
        );
      }

      return Array.from(
        folderCounts.entries(),
      ).map(
        ([folder, count]) => ({
          folder,
          count,
        }),
      );
    });
  }
}

export default new WebsiteMediaLibraryService();