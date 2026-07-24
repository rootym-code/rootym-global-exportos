import prisma from "@/lib/prisma";

import {
  FollowUpPriority,
  FollowUpStatus,
} from "@/lib/generated/prisma";


export class FollowUpMetricsService {
  async getStatusMetrics() {
    const [
      pending,
      completed,
      rescheduled,
      closed,
    ] = await prisma.$transaction([
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
          status: FollowUpStatus.RESCHEDULED,
        },
      }),

      prisma.followUp.count({
        where: {
          status: FollowUpStatus.CLOSED,
        },
      }),
    ]);


    return {
      pending,
      completed,
      rescheduled,
      closed,
    };
  }


  async getPriorityMetrics() {
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


  async getCompletionRate() {
    const [
      total,
      completed,
    ] = await prisma.$transaction([
      prisma.followUp.count(),

      prisma.followUp.count({
        where: {
          status: FollowUpStatus.COMPLETED,
        },
      }),
    ]);


    return {
      total,
      completed,

      completionRate:
        total === 0
          ? 0
          : Number(
              (
                (completed / total) *
                100
              ).toFixed(2),
            ),
    };
  }
}


const followUpMetricsService =
  new FollowUpMetricsService();


export default followUpMetricsService;