/**
 * ============================================================
 * ROOTYM CMS Page Service
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides tenant-owned CMS page operations scoped
 *          explicitly to a customer Website while preserving
 *          legacy public CMS page lookup compatibility.
 * ============================================================
 */

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
  /**
   * ------------------------------------------------------------
   * Create CMS page for a Website
   * ------------------------------------------------------------
   */
  async create(
    websiteId: string,
    data: CreateCmsPageInput
  ) {
    return this.execute(async () => {
      if (!websiteId?.trim()) {
        throw new Error(
          "Website context is required to create a CMS page."
        );
      }

      const website =
        await prisma.website.findUnique({
          where: {
            id: websiteId,
          },
          select: {
            id: true,
            isActive: true,
          },
        });

      if (!website) {
        throw new Error(
          "Website not found."
        );
      }

      if (!website.isActive) {
        throw new Error(
          "Website is inactive."
        );
      }

      const validated =
        createCmsPageSchema.parse(data);

      const { translation, ...pageData } =
        validated;

      const existing =
        await prisma.cmsPage.findFirst({
          where: {
            websiteId,
            slug: pageData.slug,
          },
        });

      this.ensureUnique(
        !!existing,
        "A page with this slug already exists for this Website."
      );

      const defaultLanguage =
        translation?.languageId
          ? null
          : await prisma.language.findFirst({
              where: {
                isDefault: true,
                isActive: true,
              },
            });

      const selectedLanguage =
        translation?.languageId
          ? await prisma.language.findFirst({
              where: {
                id: translation.languageId,
                isActive: true,
              },
            })
          : defaultLanguage;

      if (!selectedLanguage) {
        throw new Error(
          translation?.languageId
            ? "Selected page language was not found or is inactive."
            : "No default language configured. Please configure a default language before creating CMS pages."
        );
      }

      return prisma.$transaction(async (tx) => {
        const page =
          await tx.cmsPage.create({
            data: {
              ...pageData,
              websiteId,
            },
          });

        await tx.cmsPageTranslation.create({
          data: {
            pageId: page.id,
            languageId:
              selectedLanguage.id,

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

        return tx.cmsPage.findFirst({
          where: {
            id: page.id,
            websiteId,
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

  /**
   * ------------------------------------------------------------
   * Update CMS page for a Website
   * ------------------------------------------------------------
   */
  async update(
    websiteId: string,
    id: string,
    data: UpdateCmsPageInput
  ) {
    return this.execute(async () => {
      if (!websiteId?.trim()) {
        throw new Error(
          "Website context is required to update a CMS page."
        );
      }

      const validated =
        updateCmsPageSchema.parse(data);

      const { translation, ...pageData } =
        validated;

      if (pageData.slug) {
        const duplicate =
          await prisma.cmsPage.findFirst({
            where: {
              websiteId,
              slug: pageData.slug,
              NOT: {
                id,
              },
            },
          });

        this.ensureUnique(
          !!duplicate,
          "Slug already exists for this Website."
        );
      }

      return prisma.$transaction(async (tx) => {
        const page =
          this.ensureExists(
            await tx.cmsPage.findFirst({
              where: {
                id,
                websiteId,
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
          const selectedLanguageId =
            translation.languageId ??
            page.translations.find(
              (item) => item.language.isDefault
            )?.languageId ??
            page.translations[0]?.languageId;

          if (!selectedLanguageId) {
            throw new Error(
              "A page language is required before updating CMS pages."
            );
          }

          const selectedLanguage =
            await tx.language.findFirst({
              where: {
                id: selectedLanguageId,
                isActive: true,
              },
            });

          if (!selectedLanguage) {
            throw new Error(
              "Selected page language was not found or is inactive."
            );
          }

          const existingTranslation =
            page.translations.find(
              (item) =>
                item.languageId === selectedLanguage.id
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

          if (existingTranslation) {
            await tx.cmsPageTranslation.update({
              where: {
                id: existingTranslation.id,
              },
              data: translationData,
            });
          } else {
            await tx.cmsPageTranslation.create({
              data: {
                pageId: updatedPage.id,
                languageId:
                  selectedLanguage.id,
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

        return tx.cmsPage.findFirst({
          where: {
            id: updatedPage.id,
            websiteId,
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

  /**
   * ------------------------------------------------------------
   * Delete CMS page for a Website
   * ------------------------------------------------------------
   */
  async delete(
    websiteId: string,
    id: string
  ) {
    return this.execute(async () => {
      if (!websiteId?.trim()) {
        throw new Error(
          "Website context is required to delete a CMS page."
        );
      }

      const page =
        await prisma.cmsPage.findFirst({
          where: {
            id,
            websiteId,
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

  /**
   * ------------------------------------------------------------
   * Get CMS page by ID for a Website
   * ------------------------------------------------------------
   */
  async getById(
    websiteId: string,
    id: string
  ) {
    return this.execute(async () => {
      if (!websiteId?.trim()) {
        throw new Error(
          "Website context is required to retrieve a CMS page."
        );
      }

      const page =
        await prisma.cmsPage.findFirst({
          where: {
            id,
            websiteId,
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

  /**
   * ------------------------------------------------------------
   * Legacy public CMS get-by-slug operation
   * ------------------------------------------------------------
   * Preserved for the existing public CMS renderer.
   * Public Website/domain resolution will be introduced separately.
   * ------------------------------------------------------------
   */
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

  /**
   * ------------------------------------------------------------
   * Website-scoped CMS get-by-slug operation
   * ------------------------------------------------------------
   */
  async getByWebsiteAndSlug(
    websiteId: string,
    slug: string
  ) {
    if (!websiteId?.trim()) {
      throw new Error(
        "Website context is required to retrieve a CMS page."
      );
    }

    return prisma.cmsPage.findFirst({
      where: {
        websiteId,
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

  /**
   * ------------------------------------------------------------
   * Publish CMS page for a Website
   * ------------------------------------------------------------
   */
  async publish(
    websiteId: string,
    id: string
  ) {
    return this.execute(async () => {
      await this.getById(
        websiteId,
        id
      );

      return prisma.cmsPage.update({
        where: {
          id,
        },
        data: {
          status:
            CmsPageStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      });
    });
  }

  /**
   * ------------------------------------------------------------
   * Archive CMS page for a Website
   * ------------------------------------------------------------
   */
  async archive(
    websiteId: string,
    id: string
  ) {
    return this.execute(async () => {
      await this.getById(
        websiteId,
        id
      );

      return prisma.cmsPage.update({
        where: {
          id,
        },
        data: {
          status:
            CmsPageStatus.ARCHIVED,
        },
      });
    });
  }

  /**
   * ------------------------------------------------------------
   * Bulk publish CMS pages for a Website
   * ------------------------------------------------------------
   */
  async publishMany(websiteId: string, ids: string[]) {
    return this.execute(async () => {
      if (!websiteId?.trim()) throw new Error("Website context is required to publish CMS pages.");
      const pageIds = [...new Set(ids.filter((id) => typeof id === "string").map((id) => id.trim()).filter(Boolean))];
      if (pageIds.length === 0) throw new Error("At least one CMS page must be selected.");
      return prisma.$transaction(async (tx) => {
        const pages = await tx.cmsPage.findMany({ where: { websiteId, id: { in: pageIds } }, select: { id: true } });
        if (pages.length !== pageIds.length) throw new Error("One or more selected CMS pages were not found for this Website.");
        const result = await tx.cmsPage.updateMany({ where: { websiteId, id: { in: pageIds } }, data: { status: CmsPageStatus.PUBLISHED, publishedAt: new Date() } });
        return { updatedCount: result.count, pageIds, status: CmsPageStatus.PUBLISHED };
      });
    });
  }

  /**
   * ------------------------------------------------------------
   * Bulk save CMS pages as Draft for a Website
   * ------------------------------------------------------------
   */
  async draftMany(websiteId: string, ids: string[]) {
    return this.execute(async () => {
      if (!websiteId?.trim()) throw new Error("Website context is required to save CMS pages as draft.");
      const pageIds = [...new Set(ids.filter((id) => typeof id === "string").map((id) => id.trim()).filter(Boolean))];
      if (pageIds.length === 0) throw new Error("At least one CMS page must be selected.");
      return prisma.$transaction(async (tx) => {
        const pages = await tx.cmsPage.findMany({ where: { websiteId, id: { in: pageIds } }, select: { id: true } });
        if (pages.length !== pageIds.length) throw new Error("One or more selected CMS pages were not found for this Website.");
        const result = await tx.cmsPage.updateMany({ where: { websiteId, id: { in: pageIds } }, data: { status: CmsPageStatus.DRAFT, publishedAt: null } });
        return { updatedCount: result.count, pageIds, status: CmsPageStatus.DRAFT };
      });
    });
  }

  /**
   * ------------------------------------------------------------
   * Bulk archive CMS pages for a Website
   * ------------------------------------------------------------
   */
  async archiveMany(websiteId: string, ids: string[]) {
    return this.execute(async () => {
      if (!websiteId?.trim()) throw new Error("Website context is required to archive CMS pages.");
      const pageIds = [...new Set(ids.filter((id) => typeof id === "string").map((id) => id.trim()).filter(Boolean))];
      if (pageIds.length === 0) throw new Error("At least one CMS page must be selected.");
      return prisma.$transaction(async (tx) => {
        const pages = await tx.cmsPage.findMany({ where: { websiteId, id: { in: pageIds } }, select: { id: true } });
        if (pages.length !== pageIds.length) throw new Error("One or more selected CMS pages were not found for this Website.");
        const result = await tx.cmsPage.updateMany({ where: { websiteId, id: { in: pageIds } }, data: { status: CmsPageStatus.ARCHIVED } });
        return { updatedCount: result.count, pageIds, status: CmsPageStatus.ARCHIVED };
      });
    });
  }

  /**
   * ------------------------------------------------------------
   * List CMS pages for a Website
   * ------------------------------------------------------------
   */
  async list(
    websiteId: string,
    filters?: {
      status?: CmsPageStatus;
      search?: string;
    },
    pagination?: PaginationOptions
  ) {
    return this.execute(async () => {
      if (!websiteId?.trim()) {
        throw new Error(
          "Website context is required to list CMS pages."
        );
      }

      const { skip, take } =
        this.getPagination(pagination);

      const search =
        this.normalizeSearch(
          filters?.search
        );

      const where: Prisma.CmsPageWhereInput =
        {
          websiteId,
        };

      if (filters?.status) {
        where.status =
          filters.status;
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