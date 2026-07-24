import prisma from "@/lib/prisma";

import { followUpInclude } from "./followup.includes";

export class FollowUpExportService {
  async exportAll() {
    return prisma.followUp.findMany({
      include: followUpInclude,
      orderBy: [
        {
          scheduledAt: "asc",
        },
        {
          sequence: "asc",
        },
      ],
    });
  }

  async exportByInquiry(inquiryId: string) {
    return prisma.followUp.findMany({
      where: {
        inquiryId,
      },
      include: followUpInclude,
      orderBy: {
        sequence: "asc",
      },
    });
  }

  async exportAssigned(adminId: string) {
    return prisma.followUp.findMany({
      where: {
        assignedToId: adminId,
      },
      include: followUpInclude,
      orderBy: {
        scheduledAt: "asc",
      },
    });
  }

  async exportCompleted() {
    return prisma.followUp.findMany({
      where: {
        status: "COMPLETED",
      },
      include: followUpInclude,
      orderBy: {
        completedAt: "desc",
      },
    });
  }
}

const followUpExportService =
  new FollowUpExportService();

export default followUpExportService;