/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author      : Prem Singh
 * Module      : CMS
 * Feature     : Media Library Service
 * File        : lib/services/cms/media.service.ts
 * Purpose     : Manages media records, metadata, listing,
 *               soft deletion, restoration and permanent
 *               storage-aware purging.
 * ============================================================
 */

import { Prisma, MediaType } from "@/lib/generated/prisma";

import prisma from "@/lib/prisma";

import BaseCmsService, {
  PaginationOptions,
} from "@/lib/services/cms/base.service";

import getStorageProvider from "@/lib/services/storage/storage.service";

import {
  createMediaSchema,
  updateMediaSchema,
  CreateMediaInput,
  UpdateMediaInput,
} from "@/lib/validations/cms";

class MediaService extends BaseCmsService {
  async create(data: CreateMediaInput) {
    return this.execute(async () => {
      const validated =
        createMediaSchema.parse(data);

      return prisma.media.create({
        data: validated,
      });
    });
  }

  async update(
    id: string,
    data: UpdateMediaInput
  ) {
    return this.execute(async () => {
      const validated =
        updateMediaSchema.parse(data);

      await this.getById(id);

      return prisma.media.update({
        where: {
          id,
        },
        data: validated,
      });
    });
  }

  /**
   * Soft-delete a media record.
   *
   * The physical storage object is intentionally retained.
   * This allows the media record to be restored later.
   */
  async delete(id: string) {
    return this.execute(async () => {
      const media =
        await this.getById(id);

      if (media.isDeleted) {
        return media;
      }

      return prisma.media.update({
        where: {
          id,
        },
        data: {
          isDeleted: true,
        },
      });
    });
  }

  /**
   * Restore a previously soft-deleted media record.
   *
   * The underlying storage object remains untouched.
   */
  async restore(id: string) {
    return this.execute(async () => {
      const media =
        await this.getById(id);

      if (!media.isDeleted) {
        return media;
      }

      return prisma.media.update({
        where: {
          id,
        },
        data: {
          isDeleted: false,
        },
      });
    });
  }

  /**
   * Permanently purge a soft-deleted media record.
   *
   * The physical object is removed from the provider recorded
   * on the Media record before the database record is deleted.
   *
   * Purge is intentionally restricted to already soft-deleted
   * records so that normal Delete remains reversible.
   */
  async purge(id: string) {
    return this.execute(async () => {
      const media =
        await this.getById(id);

      if (!media.isDeleted) {
        throw new Error(
          "Media must be soft-deleted before it can be permanently purged."
        );
      }

      if (!media.storedFileName) {
        throw new Error(
          "Media storage key is missing. Permanent purge was not performed."
        );
      }

      if (!media.storageProvider) {
        throw new Error(
          "Media storage provider is missing. Permanent purge was not performed."
        );
      }

      const storage =
        getStorageProvider(
          media.storageProvider
        );

      /*
       * Delete the physical object first.
       *
       * If this operation fails, the database record remains
       * available so the failed purge can be retried.
       */
      await storage.delete(
        media.storedFileName
      );

      /*
       * Only remove the database record after the physical
       * storage deletion succeeds.
       */
      return prisma.media.delete({
        where: {
          id,
        },
      });
    });
  }

  async getById(id: string) {
    return this.execute(async () => {
      const media =
        await prisma.media.findUnique({
          where: {
            id,
          },
        });

      return this.ensureExists(
        media,
        "Media not found."
      );
    });
  }

  async list(
    filters?: {
      mediaType?: MediaType;
      folder?: string;
      includeDeleted?: boolean;
      search?: string;
    },
    pagination?: PaginationOptions
  ) {
    return this.execute(async () => {
      const { skip, take } =
        this.getPagination(
          pagination
        );

      const search =
        this.normalizeSearch(
          filters?.search
        );

      const where: Prisma.MediaWhereInput =
        {};

      if (filters?.mediaType) {
        where.mediaType =
          filters.mediaType;
      }

      if (filters?.folder) {
        where.folder =
          filters.folder;
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
        pagination
      );
    });
  }

  async getByFolder(
    folder: string
  ) {
    return prisma.media.findMany({
      where: {
        folder,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getImages() {
    return prisma.media.findMany({
      where: {
        mediaType:
          MediaType.IMAGE,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getDocuments() {
    return prisma.media.findMany({
      where: {
        mediaType:
          MediaType.DOCUMENT,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export default new MediaService();
