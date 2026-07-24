import prisma from "@/lib/prisma";

import {
  FollowUpStatus,
} from "@/lib/generated/prisma";

import { followUpInclude } from "./followup.includes";

export class FollowUpActions {
  async markCompleted(
    id: string,
    completedById: string,
  ) {
    return prisma.followUp.update({
      where: {
        id,
      },
      data: {
        status: FollowUpStatus.COMPLETED,
        completedById,
        completedAt: new Date(),
      },
      include: followUpInclude,
    });
  }

  async markCancelled(id: string) {
    return prisma.followUp.update({
      where: {
        id,
      },
      data: {
        status: FollowUpStatus.CANCELLED,
      },
      include: followUpInclude,
    });
  }

  async markMissed(id: string) {
    return prisma.followUp.update({
      where: {
        id,
      },
      data: {
        status: FollowUpStatus.MISSED,
      },
      include: followUpInclude,
    });
  }

  async reopen(id: string) {
    return prisma.followUp.update({
      where: {
        id,
      },
      data: {
        status: FollowUpStatus.PENDING,
        completedAt: null,
        completedById: null,
      },
      include: followUpInclude,
    });
  }

  async delete(id: string) {
    return prisma.followUp.delete({
      where: {
        id,
      },
    });
  }
}

const followUpActions = new FollowUpActions();

export default followUpActions;