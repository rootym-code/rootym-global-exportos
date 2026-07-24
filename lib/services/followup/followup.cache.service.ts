import prisma from "@/lib/prisma";

import { followUpInclude } from "./followup.includes";
import FollowUpCacheKeys from "./followup.keys";

import {
  buildFollowUpWhereClause,
} from "./followup.filters";

import {
  buildFollowUpOrderBy,
  buildFollowUpPagination,
} from "./followup.pagination";

import {
  withFollowUpCache,
} from "./followup.cache.decorators";

import type {
  FollowUpFilters,
} from "./types";

export class FollowUpCacheService {
  async getFollowUps(
    filters: FollowUpFilters = {},
  ) {
    const pagination =
      buildFollowUpPagination(filters);

    const cacheKey = [
      FollowUpCacheKeys.page(
        pagination.page,
        pagination.limit,
      ),
      JSON.stringify(filters),
    ].join(":");

    return withFollowUpCache(
      cacheKey,
      async () => {
        const where =
          buildFollowUpWhereClause(filters);

        const [items, total] =
          await prisma.$transaction([
            prisma.followUp.findMany({
              where,
              include: followUpInclude,
              orderBy:
                buildFollowUpOrderBy(filters),
              skip: pagination.skip,
              take: pagination.take,
            }),

            prisma.followUp.count({
              where,
            }),
          ]);

        return {
          items,
          total,
          page: pagination.page,
          limit: pagination.limit,
          totalPages: Math.ceil(
            total / pagination.limit,
          ),
        };
      },
      300,
    );
  }
}

const followUpCacheService =
  new FollowUpCacheService();

export default followUpCacheService;