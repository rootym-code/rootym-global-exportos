import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";

import BaseCmsService, {
  PaginationOptions,
} from "@/lib/services/cms/base.service";

import {
  createRedirectSchema,
  updateRedirectSchema,
  CreateRedirectInput,
  UpdateRedirectInput,
} from "@/lib/validations/cms";

class RedirectService extends BaseCmsService {
  async create(data: CreateRedirectInput) {
    return this.execute(async () => {
      const validated =
        createRedirectSchema.parse(data);

      const exists =
        await prisma.redirect.findUnique({
          where: {
            fromPath: validated.fromPath,
          },
        });

      this.ensureUnique(
        !!exists,
        "Redirect already exists."
      );

      return prisma.redirect.create({
        data: validated,
      });
    });
  }

  async update(
    id: string,
    data: UpdateRedirectInput
  ) {
    return this.execute(async () => {
      const validated =
        updateRedirectSchema.parse(data);

      if (validated.fromPath) {
        const duplicate =
          await prisma.redirect.findFirst({
            where: {
              fromPath: validated.fromPath,
              NOT: { id },
            },
          });

        this.ensureUnique(
          !!duplicate,
          "Redirect already exists."
        );
      }

      return prisma.redirect.update({
        where: { id },
        data: validated,
      });
    });
  }

  async delete(id: string) {
    return this.execute(async () => {
      await this.getById(id);

      return prisma.redirect.delete({
        where: { id },
      });
    });
  }

  async getById(id: string) {
    return this.execute(async () => {
      const redirect =
        await prisma.redirect.findUnique({
          where: { id },
        });

      return this.ensureExists(
        redirect,
        "Redirect not found."
      );
    });
  }

  async getByPath(path: string) {
    return prisma.redirect.findFirst({
      where: {
        fromPath: path,
        isActive: true,
      },
    });
  }

  async list(
    filters?: {
      redirectType?: "PERMANENT" | "TEMPORARY";
      isActive?: boolean;
      search?: string;
    },
    pagination?: PaginationOptions
  ) {
    return this.execute(async () => {
      const { skip, take } =
        this.getPagination(pagination);

      const search =
        this.normalizeSearch(filters?.search);

      const where: Prisma.RedirectWhereInput =
        {};

      if (filters?.redirectType) {
        where.redirectType =
          filters.redirectType;
      }

      if (
        typeof filters?.isActive ===
        "boolean"
      ) {
        where.isActive =
          filters.isActive;
      }

      if (search) {
        where.OR = [
          {
            fromPath: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            toPath: {
              contains: search,
              mode: "insensitive",
            },
          },
        ];
      }

      return this.paginate(
        () =>
          prisma.redirect.findMany({
            where,
            skip,
            take,
            orderBy: {
              createdAt: "desc",
            },
          }),
        () =>
          prisma.redirect.count({
            where,
          }),
        pagination
      );
    });
  }
}

export default new RedirectService();