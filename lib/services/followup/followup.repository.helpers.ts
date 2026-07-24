import type {
    FollowUpWhereInput,
    FollowUpOrderByInput,
  } from "./followup.repository.types";
  
  export function mergeFollowUpWhere(
    ...conditions: Array<
      FollowUpWhereInput | undefined
    >
  ): FollowUpWhereInput {
    const validConditions =
      conditions.filter(
        Boolean,
      ) as FollowUpWhereInput[];
  
    if (
      validConditions.length === 0
    ) {
      return {};
    }
  
    if (
      validConditions.length === 1
    ) {
      return validConditions[0];
    }
  
    return {
      AND: validConditions,
    };
  }
  
  export function buildFollowUpOrderBy(
    field: keyof FollowUpOrderByInput,
    direction: "asc" | "desc" = "asc",
  ): FollowUpOrderByInput {
    return {
      [field]: direction,
    } as FollowUpOrderByInput;
  }
  
  export function buildPagination(
    page = 1,
    limit = 20,
  ) {
    const safePage = Math.max(
      1,
      page,
    );
  
    const safeLimit = Math.max(
      1,
      limit,
    );
  
    return {
      skip:
        (safePage - 1) *
        safeLimit,
  
      take:
        safeLimit,
  
      page:
        safePage,
  
      limit:
        safeLimit,
    };
  }
  
  export function normalizeSearchTerm(
    value?: string | null,
  ) {
    return (
      value
        ?.trim()
        .toLowerCase() ??
      ""
    );
  }