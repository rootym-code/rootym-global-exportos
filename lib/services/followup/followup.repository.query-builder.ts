import prisma from "@/lib/prisma";

import {
  followUpRepositoryInclude,
} from "./followup.repository.include";

import {
  FollowUpRepositoryPagination,
} from "./followup.repository.pagination";

import {
  FollowUpRepositoryOrder,
} from "./followup.repository.order";

import type {
  FollowUpFindManyArgs,
  FollowUpFindUniqueArgs,
  FollowUpCountArgs,
} from "./followup.repository.types";

export class FollowUpRepositoryQuery {
  buildFindMany(
    args: FollowUpFindManyArgs = {},
  ): FollowUpFindManyArgs {
    return {
      ...args,

      include:
        args.include ??
        followUpRepositoryInclude,

      ...FollowUpRepositoryPagination.build(
        {
          page:
            typeof args.skip === "number"
              ? undefined
              : undefined,
        },
      ),

      orderBy:
        args.orderBy ??
        FollowUpRepositoryOrder.build(),
    };
  }

  buildFindUnique(
    args: FollowUpFindUniqueArgs,
  ): FollowUpFindUniqueArgs {
    return {
      ...args,

      include:
        args.include ??
        followUpRepositoryInclude,
    };
  }

  buildCount(
    args: FollowUpCountArgs = {},
  ): FollowUpCountArgs {
    return {
      ...args,
    };
  }

  async findMany(
    args: FollowUpFindManyArgs = {},
  ) {
    return prisma.followUp.findMany(
      this.buildFindMany(args),
    );
  }

  async findUnique(
    args: FollowUpFindUniqueArgs,
  ) {
    return prisma.followUp.findUnique(
      this.buildFindUnique(args),
    );
  }

  async count(
    args: FollowUpCountArgs = {},
  ) {
    return prisma.followUp.count(
      this.buildCount(args),
    );
  }
}

const followUpRepositoryQuery =
  new FollowUpRepositoryQuery();

export default followUpRepositoryQuery;