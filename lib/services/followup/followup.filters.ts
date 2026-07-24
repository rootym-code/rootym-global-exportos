import type { Prisma } from "@/lib/generated/prisma";

import type { FollowUpFilters } from "./types";

export function buildFollowUpWhereClause(
  filters: FollowUpFilters = {},
): Prisma.FollowUpWhereInput {
  const {
    inquiryId,
    assignedToId,
    status,
    priority,
    category,
    actionType,
    search,
    fromDate,
    toDate,
  } = filters;

  return {
    ...(inquiryId && {
      inquiryId,
    }),

    ...(assignedToId && {
      assignedToId,
    }),

    ...(status && {
      status,
    }),

    ...(priority && {
      priority,
    }),

    ...(category && {
      category,
    }),

    ...(actionType && {
      actionType,
    }),

    ...(fromDate || toDate
      ? {
          scheduledAt: {
            ...(fromDate && {
              gte: fromDate,
            }),

            ...(toDate && {
              lte: toDate,
            }),
          },
        }
      : {}),

    ...(search
      ? {
          OR: [
            {
              title: {
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
            {
              notes: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              inquiry: {
                companyName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
            {
              inquiry: {
                contactPerson: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          ],
        }
      : {}),
  };
}