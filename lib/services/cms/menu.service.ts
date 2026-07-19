import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";

import BaseCmsService, {
  PaginationOptions,
} from "@/lib/services/cms/base.service";

import { AppError } from "@/lib/errors/app-error";

import {
  createMenuSchema,
  updateMenuSchema,
  createMenuItemSchema,
  updateMenuItemSchema,
  CreateMenuInput,
  UpdateMenuInput,
  CreateMenuItemInput,
  UpdateMenuItemInput,
} from "@/lib/validations/cms";

class MenuService extends BaseCmsService {
  /* ============================================================
     MENU
  ============================================================ */

  async createMenu(data: CreateMenuInput) {
    return this.execute(async () => {
      const validated = createMenuSchema.parse(data);

      const exists = await prisma.menu.findUnique({
        where: {
          code: validated.code,
        },
      });

      this.ensureUnique(
        !!exists,
        "Menu code already exists."
      );

      return prisma.menu.create({
        data: validated,
      });
    });
  }

  async updateMenu(
    id: string,
    data: UpdateMenuInput
  ) {
    return this.execute(async () => {
      const validated = updateMenuSchema.parse(data);

      if (validated.code) {
        const duplicate = await prisma.menu.findFirst({
          where: {
            code: validated.code,
            NOT: {
              id,
            },
          },
        });

        this.ensureUnique(
          !!duplicate,
          "Menu code already exists."
        );
      }

      return prisma.menu.update({
        where: { id },
        data: validated,
      });
    });
  }

  async deleteMenu(id: string) {
    return this.execute(async () => {
      await this.getMenu(id);

      return prisma.menu.delete({
        where: { id },
      });
    });
  }

  async getMenu(id: string) {
    return this.execute(async () => {
      const menu = await prisma.menu.findUnique({
        where: { id },
        include: {
          items: {
            orderBy: {
              sortOrder: "asc",
            },
          },
        },
      });

      return this.ensureExists(
        menu,
        "Menu not found."
      );
    });
  }

  async listMenus(
    pagination?: PaginationOptions
  ) {
    return this.execute(async () => {
      const { skip, take } =
        this.getPagination(pagination);

      const where: Prisma.MenuWhereInput = {};

      return this.paginate(
        () =>
          prisma.menu.findMany({
            where,
            skip,
            take,
            include: {
              _count: {
                select: {
                  items: true,
                },
              },
            },
            orderBy: {
              name: "asc",
            },
          }),
        () => prisma.menu.count({ where }),
        pagination
      );
    });
  }

  /* ============================================================
     MENU ITEMS
  ============================================================ */

  async createMenuItem(
    data: CreateMenuItemInput
  ) {
    return this.execute(async () => {
      const validated =
        createMenuItemSchema.parse(data);

      if (validated.parentId) {
        const parent =
          await prisma.menuItem.findUnique({
            where: {
              id: validated.parentId,
            },
          });

        this.ensureExists(
          parent,
          "Parent menu item not found."
        );
      }

      return prisma.menuItem.create({
        data: validated,
      });
    });
  }

  async updateMenuItem(
    id: string,
    data: UpdateMenuItemInput
  ) {
    return this.execute(async () => {
      const validated =
        updateMenuItemSchema.parse(data);

      return prisma.menuItem.update({
        where: {
          id,
        },
        data: validated,
      });
    });
  }

  async deleteMenuItem(id: string) {
    return this.execute(async () => {
      await this.getMenuItem(id);

      return prisma.menuItem.delete({
        where: {
          id,
        },
      });
    });
  }

  async getMenuItem(id: string) {
    return this.execute(async () => {
      const item =
        await prisma.menuItem.findUnique({
          where: {
            id,
          },
          include: {
            children: {
              orderBy: {
                sortOrder: "asc",
              },
            },
            page: true,
          },
        });

      return this.ensureExists(
        item,
        "Menu item not found."
      );
    });
  }

  async reorder(
    items: {
      id: string;
      sortOrder: number;
    }[]
  ) {
    return this.execute(async () => {
      return prisma.$transaction(
        items.map((item) =>
          prisma.menuItem.update({
            where: {
              id: item.id,
            },
            data: {
              sortOrder: item.sortOrder,
            },
          })
        )
      );
    });
  }

  async getMenuTree(code: string) {
    return this.execute(async () => {
      const menu =
        await prisma.menu.findUnique({
          where: {
            code,
          },
          include: {
            items: {
              where: {
                isVisible: true,
              },
              orderBy: {
                sortOrder: "asc",
              },
            },
          },
        });

      if (!menu) {
        throw AppError.notFound(
          "Menu not found."
        );
      }

      return menu;
    });
  }
}

export default new MenuService();