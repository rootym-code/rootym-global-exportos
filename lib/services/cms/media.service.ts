import { Prisma, MediaType } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";

import BaseCmsService, {
  PaginationOptions,
} from "@/lib/services/cms/base.service";

import {
  createMediaSchema,
  updateMediaSchema,
  CreateMediaInput,
  UpdateMediaInput,
} from "@/lib/validations/cms";

class MediaService extends BaseCmsService {
  async create(data: CreateMediaInput) {
    return this.execute(async () => {
      const validated = createMediaSchema.parse(data);

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
      const validated = updateMediaSchema.parse(data);

      await this.getById(id);

      return prisma.media.update({
        where: {
          id,
        },
        data: validated,
      });
    });
  }

  async delete(id: string) {
    return this.execute(async () => {
      await this.getById(id);

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

  async restore(id: string) {
    return this.execute(async () => {
      await this.getById(id);

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

  async getById(id: string) {
    return this.execute(async () => {
      const media = await prisma.media.findUnique({
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
        this.getPagination(pagination);

      const search = this.normalizeSearch(
        filters?.search
      );

      const where: Prisma.MediaWhereInput = {};

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
        () => prisma.media.count({ where }),
        pagination
      );
    });
  }

  async getByFolder(folder: string) {
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
        mediaType: MediaType.IMAGE,
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
        mediaType: MediaType.DOCUMENT,
        isDeleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export default new MediaService();