import type {
    Prisma,
  } from "@/lib/generated/prisma";
  
  export type FollowUpOrderField =
    | "scheduledAt"
    | "createdAt"
    | "updatedAt"
    | "priority"
    | "sequence";
  
  export type FollowUpOrderDirection =
    | "asc"
    | "desc";
  
  export interface FollowUpOrderInput {
    field: FollowUpOrderField;
    direction?: FollowUpOrderDirection;
  }
  
  export class FollowUpRepositoryOrder {
    static build(
      input?: FollowUpOrderInput,
    ): Prisma.FollowUpOrderByWithRelationInput {
      if (!input) {
        return {
          scheduledAt: "asc",
        };
      }
  
      return {
        [input.field]:
          input.direction ?? "asc",
      };
    }
  }
  
  export default FollowUpRepositoryOrder;