import prisma from "@/lib/prisma";

import { FollowUpStatus } from "@/lib/generated/prisma";

export class FollowUpNotificationService {
  async getNotificationQueue() {
    return prisma.followUp.findMany({
      where: {
        status: FollowUpStatus.PENDING,
        scheduledAt: {
          lte: new Date(),
        },
      },
      include: {
        inquiry: true,
        assignedTo: true,
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });
  }

  async getNotificationCount() {
    return prisma.followUp.count({
      where: {
        status: FollowUpStatus.PENDING,
        scheduledAt: {
          lte: new Date(),
        },
      },
    });
  }

  async getAdminNotifications(adminId: string) {
    return prisma.followUp.findMany({
      where: {
        assignedToId: adminId,
        status: FollowUpStatus.PENDING,
        scheduledAt: {
          lte: new Date(),
        },
      },
      include: {
        inquiry: true,
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });
  }

  async getInquiryNotifications(inquiryId: string) {
    return prisma.followUp.findMany({
      where: {
        inquiryId,
        status: FollowUpStatus.PENDING,
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });
  }
}

const followUpNotificationService =
  new FollowUpNotificationService();

export default followUpNotificationService;