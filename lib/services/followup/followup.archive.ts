import prisma from "@/lib/prisma";

import {
  FollowUpStatus,
} from "@/lib/generated/prisma";

import { followUpInclude } from "./followup.includes";

export class FollowUpArchiveService {
  async getArchived() {
    return prisma.followUp.findMany({
      where: {
        status: {
          in: [
            FollowUpStatus.COMPLETED,
            FollowUpStatus.CLOSED,
            FollowUpStatus.RESCHEDULED,
          ],
        },
      },
      include: followUpInclude,
      orderBy: {
        updatedAt: "desc",
      },
    });
  }


  async getArchivedByInquiry(
    inquiryId: string,
  ) {
    return prisma.followUp.findMany({
      where: {
        inquiryId,

        status: {
          in: [
            FollowUpStatus.COMPLETED,
            FollowUpStatus.CLOSED,
            FollowUpStatus.RESCHEDULED,
          ],
        },
      },

      include: followUpInclude,

      orderBy: {
        updatedAt: "desc",
      },
    });
  }


  async getArchivedCount() {
    return prisma.followUp.count({
      where: {
        status: {
          in: [
            FollowUpStatus.COMPLETED,
            FollowUpStatus.CLOSED,
            FollowUpStatus.RESCHEDULED,
          ],
        },
      },
    });
  }
}


const followUpArchiveService =
  new FollowUpArchiveService();


export default followUpArchiveService;