import type {
    Prisma,
  } from "@/lib/generated/prisma";
  
  export const followUpListSelect =
    {
      id: true,
  
      inquiryId: true,
  
      assignedToId: true,
  
      completedById: true,
  
      sequence: true,
  
      title: true,
  
      description: true,
  
      notes: true,
  
      actionType: true,
  
      category: true,
  
      priority: true,
  
      status: true,
  
      result: true,
  
      scheduledAt: true,
  
      dueAt: true,
  
      estimatedMinutes: true,
  
      actualMinutes: true,
  
      completedAt: true,
  
      createdAt: true,
  
      updatedAt: true,
  
      inquiry: {
        select: {
          id: true,
          inquiryNumber: true,
          companyName: true,
          contactPerson: true,
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
        },
      },
  
      completedBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    } satisfies Prisma.FollowUpSelect;
  
  export const followUpDetailSelect =
    followUpListSelect;
  
  export default followUpListSelect;