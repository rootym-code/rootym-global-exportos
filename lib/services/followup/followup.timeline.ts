import prisma from "@/lib/prisma";

import { followUpInclude } from "./followup.includes";

export class FollowUpTimelineService {
  async getTimeline(inquiryId: string) {
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

  async getUpcomingTimeline(inquiryId: string) {
    return prisma.followUp.findMany({
      where: {
        inquiryId,
        status: "PENDING",
        scheduledAt: {
          gte: new Date(),
        },
      },
      include: followUpInclude,
      orderBy: {
        scheduledAt: "asc",
      },
    });
  }

  async getPastTimeline(inquiryId: string) {
    return prisma.followUp.findMany({
      where: {
        inquiryId,
        scheduledAt: {
          lt: new Date(),
        },
      },
      include: followUpInclude,
      orderBy: {
        scheduledAt: "desc",
      },
    });
  }

  async getNextFollowUp(inquiryId: string) {
    return prisma.followUp.findFirst({
      where: {
        inquiryId,
        status: "PENDING",
        scheduledAt: {
          gte: new Date(),
        },
      },
      include: followUpInclude,
      orderBy: {
        scheduledAt: "asc",
      },
    });
  }
}

const followUpTimelineService =
  new FollowUpTimelineService();

export default followUpTimelineService;