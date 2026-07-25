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

class SiteSettingService extends BaseCmsService {
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
              NOT: { id },
            },
          });

        this.ensureUnique(
          !!duplicate,
          "Setting key already exists."
        );
      }

      return prisma.siteSetting.update({
        where: { id },
        data: validated,
      });
    });
  }

  async delete(id: string) {
    return this.execute(async () => {
      await this.getById(id);

      return prisma.siteSetting.delete({
        where: { id },
      });
    });
  }

  async getById(id: string) {
    return this.execute(async () => {
      const setting =
        await prisma.siteSetting.findUnique({
          where: { id },
        });

      return this.ensureExists(
        setting,
        "Setting not found."
      );
    });
  }

  async getByKey(key: string) {
    return prisma.siteSetting.findUnique({
      where: { key },
    });
  }

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

      if (filters?.category) {
        where.category = filters.category;
      }

      if (
        typeof filters?.isPublic ===
        "boolean"
      ) {
        where.isPublic = filters.isPublic;
      }

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

export default new SiteSettingService();