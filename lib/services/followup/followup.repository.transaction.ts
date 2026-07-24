import prisma from "@/lib/prisma";

import type {
  Prisma,
} from "@/lib/generated/prisma";

export class FollowUpRepositoryTransaction {
  async execute<T>(
    callback: (
      tx: Prisma.TransactionClient,
    ) => Promise<T>,
  ): Promise<T> {
    return prisma.$transaction(
      callback,
    );
  }
}

const followUpRepositoryTransaction =
  new FollowUpRepositoryTransaction();

export default followUpRepositoryTransaction;