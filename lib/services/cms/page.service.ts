import { CmsPageStatus, Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";

import BaseCmsService, {
  PaginationOptions,
} from "@/lib/services/cms/base.service";

import {
  createCmsPageSchema,
  updateCmsPageSchema,
  CreateCmsPageInput,
  UpdateCmsPageInput,
} from "@/lib/validations/cms";

class CmsPageService extends BaseCmsService {
  async create(data: CreateCmsPageInput) {
    return this.execute(async () => {
      const validated = createCmsPageSchema.parse(data);

      const existing = await prisma.cmsPage.findUnique({
        where: {
          slug: validated.slug,
        },
      });

      this.ensureUnique(
        !!existing,
        "A page with this slug already exists."
      );

      return prisma.cmsPage.create({
        data: validated,
      });
    });
  }

  async update(
    id: string,
    data: UpdateCmsPageInput
  ) {
    return this.execute(async () => {
      const validated = updateCmsPageSchema.parse(data);

      if (validated.slug) {
        const duplicate = await prisma.cmsPage.findFirst({
          where: {
            slug: validated.slug,
            NOT: {
              id,
            },
          },
        });

        this.ensureUnique(
          !!duplicate,
          "Slug already exists."
        );
      }

      return prisma.cmsPage.update({
        where: {
          id,
        },
        data: validated,
      });
    });
  }

  async delete(id: string) {
    return this.execute(async () => {
      const page = await prisma.cmsPage.findUnique({
        where: {
          id,
        },
      });

      this.ensureExists(page, "CMS page not found.");

      return prisma.cmsPage.delete({
        where: {
          id,
        },
      });
    });
  }

  async getById(id: string) {
    return this.execute(async () => {
      const page = await prisma.cmsPage.findUnique({
        where: {
          id,
        },
        include: {
          translations: {
            include: {
              language: true,
            },
          },
        },
      });

      return this.ensureExists(
        page,
        "CMS page not found."
      );
    });
  }

  async getBySlug(slug: string) {
    return prisma.cmsPage.findUnique({
      where: {
        slug: this.normalizeSlug(slug),
      },
      include: {
        translations: {
          include: {
            language: true,
          },
        },
      },
    });
  }

  async publish(id: string) {
    return this.execute(async () => {
      await this.getById(id);

      return prisma.cmsPage.update({
        where: {
          id,
        },
        data: {
          status: CmsPageStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      });
    });
  }

  async archive(id: string) {
    return this.execute(async () => {
      await this.getById(id);

      return prisma.cmsPage.update({
        where: {
          id,
        },
        data: {
          status: CmsPageStatus.ARCHIVED,
        },
      });
    });
  }

  async list(
    filters?: {
      status?: CmsPageStatus;
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

      const where: Prisma.CmsPageWhereInput = {};

      if (filters?.status) {
        where.status = filters.status;
      }

      if (search) {
        where.OR = [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            slug: {
              contains: search,
              mode: "insensitive",
            },
          },
        ];
      }

      return this.paginate(
        () =>
          prisma.cmsPage.findMany({
            where,
            skip,
            take,
            include: {
              translations: {
                include: {
                  language: true,
                },
              },
            },
            orderBy: {
              updatedAt: "desc",
            },
          }),
        () => prisma.cmsPage.count({ where }),
        pagination
      );
    });
  }
}

export default new CmsPageService();