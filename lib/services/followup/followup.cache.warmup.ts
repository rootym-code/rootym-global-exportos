import prisma from "@/lib/prisma";

import followUpCache from "./followup.cache";
import FollowUpCacheKeys from "./followup.keys";
import { followUpInclude } from "./followup.includes";

export class FollowUpCacheWarmupService {
  async warmDashboard() {
    const dashboard = await prisma.followUp.count();

    followUpCache.set(
      FollowUpCacheKeys.dashboard(),
      dashboard,
    );

    return dashboard;
  }

  async warmPending() {
    const pending = await prisma.followUp.findMany({
      where: {
        status: "PENDING",
      },
      include: followUpInclude,
      orderBy: {
        scheduledAt: "asc",
      },
    });

    followUpCache.set(
      FollowUpCacheKeys.pending(),
      pending,
    );

    return pending;
  }

  async warmToday() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const today = await prisma.followUp.findMany({
      where: {
        status: "PENDING",
        scheduledAt: {
          gte: start,
          lte: end,
        },
      },
      include: followUpInclude,
      orderBy: {
        scheduledAt: "asc",
      },
    });

    followUpCache.set(
      FollowUpCacheKeys.today(),
      today,
    );

    return today;
  }

  async warmUpcoming() {
    const upcoming =
      await prisma.followUp.findMany({
        where: {
          status: "PENDING",
          scheduledAt: {
            gt: new Date(),
          },
        },
        include: followUpInclude,
        orderBy: {
          scheduledAt: "asc",
        },
      });

    followUpCache.set(
      FollowUpCacheKeys.upcoming(),
      upcoming,
    );

    return upcoming;
  }

  async warmAll() {
    await Promise.all([
      this.warmDashboard(),
      this.warmPending(),
      this.warmToday(),
      this.warmUpcoming(),
    ]);
  }
}

const followUpCacheWarmupService =
  new FollowUpCacheWarmupService();

export default followUpCacheWarmupService;