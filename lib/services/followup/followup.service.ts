import {
    FollowUpActionType,
    FollowUpCategory,
  } from "@/lib/generated/prisma";
  
  import prisma from "@/lib/prisma";
  
  type CreateFollowUpInput = {
    inquiryId: string;
    title: string;
    description?: string;
    actionType: FollowUpActionType;
    category: FollowUpCategory;
    scheduledAt: Date;
  };
  
  export class FollowUpService {

    async getByInquiry(inquiryId: string) {
      return prisma.followUp.findMany({
        where: {
          inquiryId,
        },
        include: {
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
        },
        orderBy: {
          scheduledAt: "asc",
        },
      });
    }
    async getPending() {
        return prisma.followUp.findMany({
          where: {
            status: "PENDING",
          },
          include: {
            inquiry: {
              select: {
                id: true,
                inquiryNumber: true,
                companyName: true,
                contactPerson: true,
              },
            },
            assignedTo: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            scheduledAt: "asc",
          },
        });
      }
  
    async getById(id: string) {
      const followUp = await prisma.followUp.findUnique({
        where: {
          id,
        },
      });
  
      if (!followUp) {
        throw new Error("Follow-up not found.");
      }
  
      return followUp;
    }
  
    async create(data: CreateFollowUpInput) {
      const inquiry = await prisma.inquiry.findUnique({
        where: {
          id: data.inquiryId,
        },
      });
  
      if (!inquiry) {
        throw new Error("Inquiry not found.");
      }
  
      return prisma.followUp.create({
        data: {
          inquiryId: data.inquiryId,
          title: data.title,
          description: data.description,
          actionType: data.actionType,
          category: data.category,
          scheduledAt: data.scheduledAt,
        },
        include: {
          inquiry: {
            select: {
              id: true,
              inquiryNumber: true,
              companyName: true,
              contactPerson: true,
            },
          },
        },
      });
    }
  }
  
  const followUpService = new FollowUpService();
  
  export default followUpService;