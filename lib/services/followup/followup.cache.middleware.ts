import type { FollowUpFilters } from "./types";

import {
  buildFollowUpWhereClause,
} from "./followup.filters";

import {
  buildFollowUpOrderBy,
  buildFollowUpPagination,
} from "./followup.pagination";

import FollowUpCacheKeys from "./followup.keys";

import {
  withFollowUpCache,
} from "./followup.cache.decorators";

import prisma from "@/lib/prisma";

import { followUpInclude } from "./followup.includes";

export async function getCachedFollowUps(
  filters: FollowUpFilters = {},
) {
  const pagination =
    buildFollowUpPagination(filters);

  const key = `${FollowUpCacheKeys.page(
    pagination.page,
    pagination.limit,
  )}:${JSON.stringify(filters)}`;

  return withFollowUpCache(
    key,
    async () => {
      const where =
        buildFollowUpWhereClause(filters);

      return prisma.followUp.findMany({
        where,
        include: followUpInclude,
        orderBy:
          buildFollowUpOrderBy(filters),
        skip: pagination.skip,
        take: pagination.take,
      });
    },
    300,
  );
}