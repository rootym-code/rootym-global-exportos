import type {
    Prisma,
  } from "@/lib/generated/prisma";
  
  import {
    buildPagination,
  } from "./followup.repository.helpers";
  
  export interface FollowUpPaginationInput {
    page?: number;
    limit?: number;
  }
  
  export class FollowUpRepositoryPagination {
    static build(
      input: FollowUpPaginationInput = {},
    ): Pick<
      Prisma.FollowUpFindManyArgs,
      "skip" | "take"
    > {
      const {
        skip,
        take,
      } = buildPagination(
        input.page,
        input.limit,
      );
  
      return {
        skip,
        take,
      };
    }
  }
  
  export default FollowUpRepositoryPagination;