import prisma from "@/lib/prisma";

import {
  FollowUpPriority,
  FollowUpStatus,
} from "@/lib/generated/prisma";

import { followUpInclude } from "./followup.includes";

export class FollowUpQueries {
  getPending() {
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

  getToday() {
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
        priority: "desc",
      },
    });
  }

  getOverdue() {
    return prisma.followUp.findMany({
      where: {
        status: FollowUpStatus.PENDING,
        scheduledAt: {
          lt: new Date(),
        },
      },
      include: followUpInclude,
      orderBy: [
        {
          priority: "desc",
        },
        {
          scheduledAt: "asc",
        },
      ],
    });
  }

  getUrgent() {
    return prisma.followUp.findMany({
      where: {
        status: FollowUpStatus.PENDING,
        priority: FollowUpPriority.URGENT,
      },
      include: followUpInclude,
      orderBy: {
        scheduledAt: "asc",
      },
    });
  }

  getCompleted(limit = 50) {
    return prisma.followUp.findMany({
      where: {
        status: FollowUpStatus.COMPLETED,
      },
      include: followUpInclude,
      orderBy: {
        completedAt: "desc",
      },
      take: limit,
    });
  }
}

const followUpQueries = new FollowUpQueries();

export default followUpQueries;