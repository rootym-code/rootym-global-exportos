/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : CMS
 * Feature     : Site Settings Service
 * File        : lib/services/cms/site-setting.service.ts
 * Purpose     : Provides centralized CRUD operations for site
 *               settings and delegates Company, Google and
 *               WhatsApp settings to their dedicated services.
 * ============================================================
 */

import { Prisma } from "@/lib/generated/prisma";

import prisma from "@/lib/prisma";

import BaseCmsService, {
  PaginationOptions,
} from "@/lib/services/cms/base.service";

import {
  createSiteSettingSchema,
  updateSiteSettingSchema,
  CreateSiteSettingInput,
  UpdateSiteSettingInput,
} from "@/lib/validations/cms";

import companySettingsService from "./settings/company-settings.service";
import googleSettingsService from "./settings/google-settings.service";
import whatsappSettingsService from "./settings/whatsapp-settings.service";

import {
  CompanySettingsInput,
  GoogleSettingsInput,
  WhatsAppSettingsInput,
} from "./settings/types";

/* ============================================================
   Site Setting Service
============================================================ */

class SiteSettingService extends BaseCmsService {
  /* ============================================================
     Create Site Setting
  ============================================================ */

  async create(data: CreateSiteSettingInput) {
    return this.execute(async () => {
      const validated =
        createSiteSettingSchema.parse(data);

      const exists =
        await prisma.siteSetting.findUnique({
          where: {
            key: validated.key,
          },
        });

      this.ensureUnique(
        !!exists,
        "Setting key already exists."
      );

      return prisma.siteSetting.create({
        data: validated,
      });
    });
  }

  /* ============================================================
     Update Site Setting
  ============================================================ */

  async update(
    id: string,
    data: UpdateSiteSettingInput
  ) {
    return this.execute(async () => {
      const validated =
        updateSiteSettingSchema.parse(data);

      if (validated.key) {
        const duplicate =
          await prisma.siteSetting.findFirst({
            where: {
              key: validated.key,
              NOT: {
                id,
              },
            },
          });

        this.ensureUnique(
          !!duplicate,
          "Setting key already exists."
        );
      }

      return prisma.siteSetting.update({
        where: {
          id,
        },
        data: validated,
      });
    });
  }

  /* ============================================================
     Delete Site Setting
  ============================================================ */

  async delete(id: string) {
    return this.execute(async () => {
      await this.getById(id);

      return prisma.siteSetting.delete({
        where: {
          id,
        },
      });
    });
  }

  /* ============================================================
     Get Site Setting By ID
  ============================================================ */

  async getById(id: string) {
    return this.execute(async () => {
      const setting =
        await prisma.siteSetting.findUnique({
          where: {
            id,
          },
        });

      return this.ensureExists(
        setting,
        "Setting not found."
      );
    });
  }

  /* ============================================================
     Get Site Setting By Key
  ============================================================ */

  async getByKey(key: string) {
    return prisma.siteSetting.findUnique({
      where: {
        key,
      },
    });
  }

  /* ============================================================
     Company Settings
  ============================================================ */

  async getCompanySettings() {
    return this.execute(async () => {
      return companySettingsService.getCompanySettings();
    });
  }

  async saveCompanySettings(
    data: CompanySettingsInput
  ) {
    return this.execute(async () => {
      return companySettingsService.saveCompanySettings(
        data
      );
    });
  }

  /* ============================================================
     Google Settings
  ============================================================ */

  async getGoogleSettings() {
    return this.execute(async () => {
      return googleSettingsService.getGoogleSettings();
    });
  }

  async saveGoogleSettings(
    data: GoogleSettingsInput
  ) {
    return this.execute(async () => {
      return googleSettingsService.saveGoogleSettings(
        data
      );
    });
  }

  /* ============================================================
     WhatsApp Settings
  ============================================================ */

  async getWhatsAppSettings() {
    return this.execute(async () => {
      return whatsappSettingsService.getWhatsAppSettings();
    });
  }

  async saveWhatsAppSettings(
    data: WhatsAppSettingsInput
  ) {
    return this.execute(async () => {
      return whatsappSettingsService.saveWhatsAppSettings(
        data
      );
    });
  }

  /* ============================================================
     List Site Settings
  ============================================================ */

  async list(
    filters?: {
      category?: string;
      isPublic?: boolean;
      search?: string;
    },
    pagination?: PaginationOptions
  ) {
    return this.execute(async () => {
      const { skip, take } =
        this.getPagination(pagination);

      const search =
        this.normalizeSearch(filters?.search);

      const where: Prisma.SiteSettingWhereInput =
        {};

      /* --------------------------------------------------------
         Category Filter
      -------------------------------------------------------- */

      if (filters?.category) {
        where.category =
          filters.category;
      }

      /* --------------------------------------------------------
         Public Visibility Filter
      -------------------------------------------------------- */

      if (
        typeof filters?.isPublic ===
        "boolean"
      ) {
        where.isPublic =
          filters.isPublic;
      }

      /* --------------------------------------------------------
         Search Filter
      -------------------------------------------------------- */

      if (search) {
        where.OR = [
          {
            key: {
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

      /* --------------------------------------------------------
         Paginated Result
      -------------------------------------------------------- */

      return this.paginate(
        () =>
          prisma.siteSetting.findMany({
            where,
            skip,
            take,
            orderBy: {
              category: "asc",
            },
          }),

        () =>
          prisma.siteSetting.count({
            where,
          }),

        pagination
      );
    });
  }
}

/* ============================================================
   Service Instance
============================================================ */

export default new SiteSettingService();