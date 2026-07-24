import prisma from "@/lib/prisma";

import {
  FollowUpPriority,
  FollowUpStatus,
} from "@/lib/generated/prisma";

export class FollowUpAnalyticsService {
  async getOverview() {
    const [
      total,
      pending,
      completed,
      overdue,
      urgent,
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

      prisma.followUp.count({
        where: {
          priority: FollowUpPriority.URGENT,
          status: FollowUpStatus.PENDING,
        },
      }),
    ]);

    return {
      total,
      pending,
      completed,
      overdue,
      urgent,
    };
  }

  async getAverageCompletionTime() {
    const followUps = await prisma.followUp.findMany({
      where: {
        status: FollowUpStatus.COMPLETED,
        completedAt: {
          not: null,
        },
      },
      select: {
        scheduledAt: true,
        completedAt: true,
      },
    });

    if (followUps.length === 0) {
      return {
        averageHours: 0,
      };
    }

    const totalHours = followUps.reduce((sum, item) => {
      const completedAt = item.completedAt!;

      return (
        sum +
        (completedAt.getTime() -
          item.scheduledAt.getTime()) /
          (1000 * 60 * 60)
      );
    }, 0);

    return {
      averageHours: Number(
        (totalHours / followUps.length).toFixed(2),
      ),
    };
  }

  async getCompletionTrend() {
    return prisma.followUp.groupBy({
      by: ["status"],
      _count: {
        _all: true,
      },
    });
  }
}

const followUpAnalyticsService =
  new FollowUpAnalyticsService();

export default followUpAnalyticsService;