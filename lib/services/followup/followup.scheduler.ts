import prisma from "@/lib/prisma";

import {
  FollowUpStatus,
} from "@/lib/generated/prisma";


export class FollowUpScheduler {

  async markOverdueFollowUps() {
    const result =
      await prisma.followUp.count({
        where: {
          status: FollowUpStatus.PENDING,

          scheduledAt: {
            lt: new Date(),
          },
        },
      });

    return result;
  }


  async getOverdueFollowUps() {
    return prisma.followUp.findMany({
      where: {
        status: FollowUpStatus.PENDING,

        scheduledAt: {
          lt: new Date(),
        },
      },

      orderBy: {
        scheduledAt: "asc",
      },
    });
  }


  async getDueFollowUps() {
    const now = new Date();

    return prisma.followUp.findMany({
      where: {
        status: FollowUpStatus.PENDING,

        scheduledAt: {
          lte: now,
        },
      },

      orderBy: {
        scheduledAt: "asc",
      },
    });
  }


  async getDueCount() {
    return prisma.followUp.count({
      where: {
        status: FollowUpStatus.PENDING,

        scheduledAt: {
          lte: new Date(),
        },
      },
    });
  }
}


const followUpScheduler =
  new FollowUpScheduler();


export default followUpScheduler;