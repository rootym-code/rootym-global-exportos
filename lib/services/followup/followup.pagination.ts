import type {
  FollowUpEntity,
} from "./followup.entity";

import type {
  Prisma,
} from "@/lib/generated/prisma";


export interface FollowUpPaginationResult {
  items: FollowUpEntity[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}


export function paginateFollowUps(
  followUps: FollowUpEntity[],
  page: number,
  pageSize: number,
): FollowUpPaginationResult {
  const safePage =
    Math.max(1, page);

  const safePageSize =
    Math.max(1, pageSize);

  const totalItems =
    followUps.length;

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalItems / safePageSize,
      ),
    );

  const start =
    (safePage - 1) *
    safePageSize;

  return {
    items:
      followUps.slice(
        start,
        start + safePageSize,
      ),

    page: safePage,

    pageSize:
      safePageSize,

    totalItems,

    totalPages,

    hasNextPage:
      safePage < totalPages,

    hasPreviousPage:
      safePage > 1,
  };
}


/**
 * Compatibility layer for existing cache middleware
 */
export function buildFollowUpPagination(
  filters: {
    page?: number;
    limit?: number;
  } = {},
) {
  const page =
    Math.max(
      1,
      filters.page ?? 1,
    );

  const limit =
    Math.max(
      1,
      filters.limit ?? 20,
    );

  return {
    page,

    limit,

    skip:
      (page - 1) *
      limit,

    take:
      limit,
  };
}


/**
 * Compatibility layer for existing cache middleware
 */
/**
 * Existing cache middleware compatibility
 */
export function buildFollowUpOrderBy(
  filters: unknown = {},
): Prisma.FollowUpOrderByWithRelationInput {
  const value =
    typeof filters === "object" &&
    filters !== null
      ? filters as {
          sortBy?: string;
          sortOrder?: "asc" | "desc";
        }
      : {};

  const sortField =
    value.sortBy ??
    "scheduledAt";

  const sortOrder =
    value.sortOrder ??
    "asc";

  return {
    [sortField]:
      sortOrder,
  } as Prisma.FollowUpOrderByWithRelationInput;
}