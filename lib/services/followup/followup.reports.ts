import prisma from "@/lib/prisma";

import {
  FollowUpPriority,
  FollowUpStatus,
} from "@/lib/generated/prisma";

export class FollowUpReportsService {
  async getExecutiveReport() {
    const [
      total,
      pending,
      completed,
      overdue,
    ] = await prisma.$transaction([
      prisma.followUp.count(),

      prisma.followUp.count({
        where: {
          status: FollowUpStatus.PENDING,
        },
      }),

      prisma.followUp.count({
        where: {
          status: FollowUpStatus.COMPLETED,
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
    ]);

    return {
      total,
      pending,
      completed,
      overdue,
    };
  }

  async getPriorityReport() {
    const [
      urgent,
      high,
      medium,
      low,
    ] = await prisma.$transaction([
      prisma.followUp.count({
        where: {
          priority: FollowUpPriority.URGENT,
        },
      }),

      prisma.followUp.count({
        where: {
          priority: FollowUpPriority.HIGH,
        },
      }),

      prisma.followUp.count({
        where: {
          priority: FollowUpPriority.MEDIUM,
        },
      }),

      prisma.followUp.count({
        where: {
          priority: FollowUpPriority.LOW,
        },
      }),
    ]);

    return {
      urgent,
      high,
      medium,
      low,
    };
  }

  async getDailySummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.followUp.findMany({
      where: {
        scheduledAt: {
          gte: today,
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });
  }
}

const followUpReportsService =
  new FollowUpReportsService();

export default followUpReportsService;