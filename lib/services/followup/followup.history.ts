import prisma from "@/lib/prisma";

import { followUpInclude } from "./followup.includes";

export class FollowUpHistoryService {
  async getHistory(inquiryId: string) {
    return prisma.followUp.findMany({
      where: {
        inquiryId,
      },
      include: followUpInclude,
      orderBy: [
        {
          sequence: "asc",
        },
        {
          createdAt: "asc",
        },
      ],
    });
  }

  async getCompletedHistory(inquiryId: string) {
    return prisma.followUp.findMany({
      where: {
        inquiryId,
        status: "COMPLETED",
      },
      include: followUpInclude,
      orderBy: {
        completedAt: "desc",
      },
    });
  }

  async getLatest(inquiryId: string) {
    return prisma.followUp.findFirst({
      where: {
        inquiryId,
      },
      include: followUpInclude,
      orderBy: {
        sequence: "desc",
      },
    });
  }

  async getLatestPending(inquiryId: string) {
    return prisma.followUp.findFirst({
      where: {
        inquiryId,
        status: "PENDING",
      },
      include: followUpInclude,
      orderBy: {
        scheduledAt: "asc",
      },
    });
  }
}

const followUpHistoryService =
  new FollowUpHistoryService();

export default followUpHistoryService;