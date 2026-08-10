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

      const { translation, ...pageData } = validated;

      const existing = await prisma.cmsPage.findUnique({
        where: {
          slug: pageData.slug,
        },
      });

      this.ensureUnique(
        !!existing,
        "A page with this slug already exists."
      );

      const defaultLanguage =
        await prisma.language.findFirst({
          where: {
            isDefault: true,
            isActive: true,
          },
        });

      if (!defaultLanguage) {
        throw new Error(
          "No default language configured. Please configure a default language before creating CMS pages."
        );
      }

      if (
        translation?.languageId &&
        translation.languageId !== defaultLanguage.id
      ) {
        throw new Error(
          "CMS page translation must use the configured default language."
        );
      }

      return prisma.$transaction(async (tx) => {
        const page = await tx.cmsPage.create({
          data: pageData,
        });

        await tx.cmsPageTranslation.create({
          data: {
            pageId: page.id,
            languageId: defaultLanguage.id,

            title:
              translation?.title ??
              page.title,

            slug:
              translation?.slug ??
              page.slug,

            excerpt:
              translation?.excerpt ??
              null,

            content:
              translation?.content ??
              null,

            ...(translation?.structuredContent !== undefined && {
              structuredContent:
                translation.structuredContent as Prisma.InputJsonValue,
            }),

            metaTitle:
              translation?.metaTitle ??
              page.metaTitle,

            metaDescription:
              translation?.metaDescription ??
              page.metaDescription,

            metaKeywords:
              translation?.metaKeywords ??
              page.metaKeywords,

            isPublished:
              translation?.isPublished ??
              page.status ===
                CmsPageStatus.PUBLISHED,
          },
        });

        return tx.cmsPage.findUnique({
          where: {
            id: page.id,
          },
          include: {
            translations: {
              include: {
                language: true,
              },
            },
          },
        });
      });
    });
  }

  async update(
    id: string,
    data: UpdateCmsPageInput
  ) {
    return this.execute(async () => {
      const validated =
        updateCmsPageSchema.parse(data);

      const { translation, ...pageData } =
        validated;

      if (pageData.slug) {
        const duplicate =
          await prisma.cmsPage.findFirst({
            where: {
              slug: pageData.slug,
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

      return prisma.$transaction(async (tx) => {
        const page =
          this.ensureExists(
            await tx.cmsPage.findUnique({
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
            }),
            "CMS page not found."
          );

        const updatedPage =
          await tx.cmsPage.update({
            where: {
              id,
            },
            data: pageData,
          });

        if (translation) {
          const defaultLanguage =
            await tx.language.findFirst({
              where: {
                isDefault: true,
                isActive: true,
              },
            });

          if (!defaultLanguage) {
            throw new Error(
              "No default language configured. Please configure a default language before updating CMS pages."
            );
          }

          if (
            translation.languageId &&
            translation.languageId !==
              defaultLanguage.id
          ) {
            throw new Error(
              "CMS page translation must use the configured default language."
            );
          }

          const defaultTranslation =
            page.translations.find(
              (item) =>
                item.language.isDefault
            );

          const translationData = {
            title: translation.title,

            slug: translation.slug,

            excerpt:
              translation.excerpt ??
              null,

            content:
              translation.content ??
              null,

            ...(translation.structuredContent !== undefined && {
              structuredContent:
                translation.structuredContent as Prisma.InputJsonValue,
            }),

            metaTitle:
              translation.metaTitle ??
              updatedPage.metaTitle,

            metaDescription:
              translation.metaDescription ??
              updatedPage.metaDescription,

            metaKeywords:
              translation.metaKeywords ??
              updatedPage.metaKeywords,

            isPublished:
              translation.isPublished ??
              updatedPage.status ===
                CmsPageStatus.PUBLISHED,
          };

          if (defaultTranslation) {
            await tx.cmsPageTranslation.update({
              where: {
                id: defaultTranslation.id,
              },
              data: translationData,
            });
          } else {
            await tx.cmsPageTranslation.create({
              data: {
                pageId: updatedPage.id,
                languageId:
                  defaultLanguage.id,
                ...translationData,
              },
            });
          }
        } else {
          const defaultTranslation =
            page.translations.find(
              (item) =>
                item.language.isDefault
            );

          if (defaultTranslation) {
            await tx.cmsPageTranslation.update({
              where: {
                id: defaultTranslation.id,
              },
              data: {
                ...(pageData.title !==
                  undefined && {
                  title:
                    pageData.title,
                }),

                ...(pageData.slug !==
                  undefined && {
                  slug:
                    pageData.slug,
                }),

                ...(pageData.metaTitle !==
                  undefined && {
                  metaTitle:
                    pageData.metaTitle,
                }),

                ...(pageData.metaDescription !==
                  undefined && {
                  metaDescription:
                    pageData.metaDescription,
                }),

                ...(pageData.metaKeywords !==
                  undefined && {
                  metaKeywords:
                    pageData.metaKeywords,
                }),

                ...(pageData.status !==
                  undefined && {
                  isPublished:
                    pageData.status ===
                    CmsPageStatus.PUBLISHED,
                }),
              },
            });
          }
        }

        return tx.cmsPage.findUnique({
          where: {
            id: updatedPage.id,
          },
          include: {
            translations: {
              include: {
                language: true,
              },
            },
          },
        });
      });
    });
  }

  async delete(id: string) {
    return this.execute(async () => {
      const page =
        await prisma.cmsPage.findUnique({
          where: {
            id,
          },
        });

      this.ensureExists(
        page,
        "CMS page not found."
      );

      return prisma.cmsPage.delete({
        where: {
          id,
        },
      });
    });
  }

  async getById(id: string) {
    return this.execute(async () => {
      const page =
        await prisma.cmsPage.findUnique({
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

      const search =
        this.normalizeSearch(
          filters?.search
        );

      const where: Prisma.CmsPageWhereInput =
        {};

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
        () =>
          prisma.cmsPage.count({
            where,
          }),
        pagination
      );
    });
  }
}

export default new CmsPageService();