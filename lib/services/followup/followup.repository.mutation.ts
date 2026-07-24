import prisma from "@/lib/prisma";

import type {
  FollowUpCreateInput,
  FollowUpUpdateInput,
  FollowUpUncheckedCreateInput,
  FollowUpUncheckedUpdateInput,
} from "./followup.repository.types";

import followUpRepositoryCache from "./followup.repository.cache";

export class FollowUpRepositoryMutation {
  async create(
    data:
      | FollowUpCreateInput
      | FollowUpUncheckedCreateInput,
  ) {
    const followUp =
      await prisma.followUp.create({
        data,
      });

    followUpRepositoryCache.clearInquiry(
      followUp.inquiryId,
    );

    return followUp;
  }

  async update(
    id: string,
    data:
      | FollowUpUpdateInput
      | FollowUpUncheckedUpdateInput,
  ) {
    const followUp =
      await prisma.followUp.update({
        where: {
          id,
        },
        data,
      });

    followUpRepositoryCache.clearFollowUp(
      id,
    );

    followUpRepositoryCache.clearInquiry(
      followUp.inquiryId,
    );

    return followUp;
  }

  async delete(
    id: string,
  ) {
    const followUp =
      await prisma.followUp.delete({
        where: {
          id,
        },
      });

    followUpRepositoryCache.clearFollowUp(
      id,
    );

    followUpRepositoryCache.clearInquiry(
      followUp.inquiryId,
    );

    return followUp;
  }
}

const followUpRepositoryMutation =
  new FollowUpRepositoryMutation();

export default followUpRepositoryMutation;