import {
    FollowUpPriority,
    FollowUpStatus,
  } from "@/lib/generated/prisma";
  
  import prisma from "@/lib/prisma";
  
  import { followUpInclude } from "./followup.includes";
  
  import type {
    AssignFollowUpInput,
    CompleteFollowUpInput,
    CreateFollowUpInput,
    FollowUpDashboardSummary,
    FollowUpFilters,
    RescheduleFollowUpInput,
    SnoozeFollowUpInput,
    UpdateFollowUpInput,
  } from "./types";
  
  export class FollowUpService {
    async findMany(filters: FollowUpFilters = {}) {
      const {
        inquiryId,
        assignedToId,
        status,
        priority,
        category,
        actionType,
        fromDate,
        toDate,
        search,
        page = 1,
        limit = 20,
      } = filters;
  
      const where = {
        ...(inquiryId && { inquiryId }),
  
        ...(assignedToId && { assignedToId }),
  
        ...(status && { status }),
  
        ...(priority && { priority }),
  
        ...(category && { category }),
  
        ...(actionType && { actionType }),
  
        ...(fromDate || toDate
          ? {
              scheduledAt: {
                ...(fromDate && { gte: fromDate }),
                ...(toDate && { lte: toDate }),
              },
            }
          : {}),
  
        ...(search
          ? {
              OR: [
                {
                  title: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
                {
                  inquiry: {
                    companyName: {
                      contains: search,
                      mode: "insensitive" as const,
                    },
                  },
                },
                {
                  inquiry: {
                    contactPerson: {
                      contains: search,
                      mode: "insensitive" as const,
                    },
                  },
                },
              ],
            }
          : {}),
      };
  
      const [items, total] = await prisma.$transaction([
        prisma.followUp.findMany({
          where,
          include: followUpInclude,
          orderBy: [
            {
              scheduledAt: "asc",
            },
            {
              createdAt: "desc",
            },
          ],
          skip: (page - 1) * limit,
          take: limit,
        }),
  
        prisma.followUp.count({
          where,
        }),
      ]);
  
      return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }
  
    async getByInquiry(inquiryId: string) {
      return prisma.followUp.findMany({
        where: {
          inquiryId,
        },
        include: followUpInclude,
        orderBy: {
          scheduledAt: "asc",
        },
      });
    }
  
    async getPending() {
      return prisma.followUp.findMany({
        where: {
          status: FollowUpStatus.PENDING,
        },
        include: followUpInclude,
        orderBy: {
          scheduledAt: "asc",
        },
      });
    }
  
    async getToday() {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
  
      const end = new Date();
      end.setHours(23, 59, 59, 999);
  
      return prisma.followUp.findMany({
        where: {
          status: FollowUpStatus.PENDING,
          scheduledAt: {
            gte: start,
            lte: end,
          },
        },
        include: followUpInclude,
        orderBy: {
          scheduledAt: "asc",
        },
      });
    }
  
    async getUpcoming() {
      const tomorrow = new Date();
      tomorrow.setHours(23, 59, 59, 999);
  
      return prisma.followUp.findMany({
        where: {
          status: FollowUpStatus.PENDING,
          scheduledAt: {
            gt: tomorrow,
          },
        },
        include: followUpInclude,
        orderBy: {
          scheduledAt: "asc",
        },
      });
    }
  
    async getOverdue() {
      return prisma.followUp.findMany({
        where: {
          status: FollowUpStatus.PENDING,
          scheduledAt: {
            lt: new Date(),
          },
        },
        include: followUpInclude,
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
        include: followUpInclude,
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
  
      const lastSequence = await prisma.followUp.aggregate({
        where: {
          inquiryId: data.inquiryId,
        },
        _max: {
          sequence: true,
        },
      });
  
      return prisma.followUp.create({
        data: {
          inquiryId: data.inquiryId,
          sequence: (lastSequence._max.sequence ?? 0) + 1,
          title: data.title,
          description: data.description,
          notes: data.notes,
          actionType: data.actionType,
          category: data.category,
          priority: data.priority ?? FollowUpPriority.MEDIUM,
          scheduledAt: data.scheduledAt,
          dueAt: data.dueAt,
          assignedToId: data.assignedToId,
          estimatedMinutes: data.estimatedMinutes,
        },
        include: followUpInclude,
      });
    }  async update(id: string, data: UpdateFollowUpInput) {
        await this.getById(id);
    
        return prisma.followUp.update({
          where: {
            id,
          },
          data: {
            ...data,
          },
          include: followUpInclude,
        });
      }
    
      async assign(id: string, data: AssignFollowUpInput) {
        const admin = await prisma.admin.findUnique({
          where: {
            id: data.assignedToId,
          },
        });
    
        if (!admin) {
          throw new Error("Assigned admin not found.");
        }
    
        await this.getById(id);
    
        return prisma.followUp.update({
          where: {
            id,
          },
          data: {
            assignedToId: data.assignedToId,
          },
          include: followUpInclude,
        });
      }
    
      async complete(
        id: string,
        data: CompleteFollowUpInput,
        completedById: string,
      ) {
        await this.getById(id);
    
        return prisma.followUp.update({
          where: {
            id,
          },
          data: {
            status: FollowUpStatus.COMPLETED,
            result: data.result,
            notes: data.notes,
            actualMinutes: data.actualMinutes,
            completedById,
            completedAt: new Date(),
          },
          include: followUpInclude,
        });
      }
    
      async reschedule(
        id: string,
        data: RescheduleFollowUpInput,
      ) {
        await this.getById(id);
    
        return prisma.followUp.update({
          where: {
            id,
          },
          data: {
            scheduledAt: data.scheduledAt,
            dueAt: data.dueAt,
            notes: data.notes,
            status: FollowUpStatus.PENDING,
          },
          include: followUpInclude,
        });
      }
    
      async snooze(
        id: string,
        data: SnoozeFollowUpInput,
      ) {
        const followUp = await this.getById(id);
    
        const notes = data.reason
          ? `${followUp.notes ?? ""}\n\nSnoozed: ${data.reason}`.trim()
          : followUp.notes;
    
        return prisma.followUp.update({
          where: {
            id,
          },
          data: {
            scheduledAt: data.scheduledAt,
            notes,
          },
          include: followUpInclude,
        });
      }
    
      async getDashboardSummary(): Promise<FollowUpDashboardSummary> {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
    
        const end = new Date();
        end.setHours(23, 59, 59, 999);
    
        const [pending, overdue, today, upcoming, completed] =
          await prisma.$transaction([
            prisma.followUp.count({
              where: {
                status: FollowUpStatus.PENDING,
              },
            }),
    
            prisma.followUp.count({
              where: {
                status: FollowUpStatus.PENDING,
                scheduledAt: {
                  lt: new Date(),
                },
              },
            }),
    
            prisma.followUp.count({
              where: {
                status: FollowUpStatus.PENDING,
                scheduledAt: {
                  gte: start,
                  lte: end,
                },
              },
            }),
    
            prisma.followUp.count({
              where: {
                status: FollowUpStatus.PENDING,
                scheduledAt: {
                  gt: end,
                },
              },
            }),
    
            prisma.followUp.count({
              where: {
                status: FollowUpStatus.COMPLETED,
              },
            }),
          ]);
    
        return {
          pending,
          overdue,
          today,
          upcoming,
          completed,
        };
      }

      async delete(id: string) {
        await this.getById(id);
    
        await prisma.followUp.delete({
          where: {
            id,
          },
        });
    
        return {
          success: true,
        };
      }
      
    }
    
    const followUpService = new FollowUpService();
    
    export default followUpService;