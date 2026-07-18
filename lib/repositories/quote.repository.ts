/**
 * ============================================================
 * ROOTYM
 * File: lib/repositories/quote.repository.ts
 * Sprint 8.1
 * ============================================================
 */

import { Prisma } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";

export interface QuoteListOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export class QuoteRepository {
  async findMany(options: QuoteListOptions = {}) {
    const page = Math.max(1, options.page ?? 1);

    const pageSize = Math.max(
      1,
      Math.min(100, options.pageSize ?? 10)
    );

    const where: Prisma.QuoteWhereInput = {};

    if (options.status) {
      where.status = options.status as any;
    }

    if (options.search?.trim()) {
      const search = options.search.trim();

      where.OR = [
        {
          quoteNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          companyName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          contactPerson: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const [items, total] =
      await prisma.$transaction([
        prisma.quote.findMany({
          where,
          include: {
            inquiry: true,
            items: {
              include: {
                product: true,
              },
            },
            createdBy: true,
            updatedBy: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),

        prisma.quote.count({
          where,
        }),
      ]);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.max(
        1,
        Math.ceil(total / pageSize)
      ),
    };
  }

  async findById(id: string) {
    return prisma.quote.findUnique({
      where: {
        id,
      },
      include: {
        inquiry: true,
        items: {
          include: {
            product: true,
          },
        },
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  async create(
    data: Prisma.QuoteCreateInput
  ) {
    return prisma.quote.create({
      data,
      include: {
        inquiry: true,
        items: {
          include: {
            product: true,
          },
        },
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.QuoteUpdateInput
  ) {
    return prisma.quote.update({
      where: {
        id,
      },
      data,
      include: {
        inquiry: true,
        items: {
          include: {
            product: true,
          },
        },
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.quote.delete({
      where: {
        id,
      },
    });
  }

  async exists(id: string) {
    const count =
      await prisma.quote.count({
        where: {
          id,
        },
      });

    return count > 0;
  }

  async updateStatus(
    id: string,
    status: string
  ) {
    return prisma.quote.update({
      where: {
        id,
      },
      data: {
        status: status as any,
      },
      include: {
        inquiry: true,
        items: {
          include: {
            product: true,
          },
        },
        createdBy: true,
        updatedBy: true,
      },
    });
  }

  async nextSequence(): Promise<number> {
    const latest =
      await prisma.quote.findFirst({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          quoteNumber: true,
        },
      });

    if (!latest) {
      return 1;
    }

    const match =
      latest.quoteNumber.match(
        /(\d+)$/
      );

    if (!match) {
      return 1;
    }

    return Number(match[1]) + 1;
  }
}

export const quoteRepository =
  new QuoteRepository();