import type {
    Prisma,
  } from "@/lib/generated/prisma";
  
  export const followUpRepositoryInclude =
    {
      inquiry: {
        select: {
          id: true,
          inquiryNumber: true,
          companyName: true,
          contactPerson: true,
          email: true,
          phone: true,
          country: true,
          product: true,
          salesStage: true,
        },
      },
  
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
  
      completedBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    } satisfies Prisma.FollowUpInclude;
  
  export type FollowUpRepositoryInclude =
    typeof followUpRepositoryInclude;