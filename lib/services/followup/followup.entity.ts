import type {
    FollowUp,
    Prisma,
  } from "@/lib/generated/prisma";
  
  export type FollowUpEntity = Prisma.FollowUpGetPayload<{
    include: {
      inquiry: true;
      assignedTo: true;
      completedBy: true;
    };
  }>;
  
  export type FollowUpCreateData =
    Prisma.FollowUpCreateInput;
  
  export type FollowUpUpdateData =
    Prisma.FollowUpUpdateInput;
  
  export type FollowUpWhereInput =
    Prisma.FollowUpWhereInput;
  
  export type FollowUpOrderByInput =
    Prisma.FollowUpOrderByWithRelationInput;
  
  export type FollowUpSelect =
    Prisma.FollowUpSelect;
  
  export type FollowUpInclude =
    Prisma.FollowUpInclude;
  
  export type FollowUpUncheckedCreateData =
    Prisma.FollowUpUncheckedCreateInput;
  
  export type FollowUpUncheckedUpdateData =
    Prisma.FollowUpUncheckedUpdateInput;
  
  export type FollowUpModel =
    FollowUp;