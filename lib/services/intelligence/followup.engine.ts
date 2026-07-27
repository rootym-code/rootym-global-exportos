import prisma from "@/lib/prisma";
import { FollowUpStatus } from "@/lib/generated/prisma";
import {
  FollowUpIntelligence,
  Recommendation,
} from "./intelligence.types";

export async function getFollowUpIntelligence(): Promise<FollowUpIntelligence> {
  const now = new Date();

  const [
    overdue,
    dueToday,
    upcoming,
    urgent,
    completedToday,
  ] = await Promise.all([
    prisma.followUp.count({
      where: {
        dueAt: {
          not: null,
          lt: now,
        },
        status: {
          notIn: [
            FollowUpStatus.COMPLETED,
            FollowUpStatus.CLOSED,
          ],
        },
      },
    }),

    prisma.followUp.count({
      where: {
        dueAt: {
          gte: startOfToday(),
          lt: startOfTomorrow(),
        },
        status: {
          notIn: [
            FollowUpStatus.COMPLETED,
            FollowUpStatus.CLOSED,
          ],
        },
      },
    }),

    prisma.followUp.count({
      where: {
        dueAt: {
          gte: startOfTomorrow(),
        },
        status: {
          notIn: [
            FollowUpStatus.COMPLETED,
            FollowUpStatus.CLOSED,
          ],
        },
      },
    }),

    prisma.followUp.count({
      where: {
        priority: "URGENT",
        status: {
          notIn: [
            FollowUpStatus.COMPLETED,
            FollowUpStatus.CLOSED,
          ],
        },
      },
    }),

    prisma.followUp.count({
      where: {
        completedAt: {
          gte: startOfToday(),
          lt: startOfTomorrow(),
        },
      },
    }),
  ]);

  const recommendations: Recommendation[] = [];

  if (overdue > 0) {
    recommendations.push({
      priority: "CRITICAL",
      title: "Overdue Follow-ups",
      description: `${overdue} follow-up(s) are overdue.`,
      action: "Review and contact the overdue buyers immediately.",
    });
  }

  if (urgent > 0) {
    recommendations.push({
      priority: "HIGH",
      title: "Urgent Follow-ups",
      description: `${urgent} urgent follow-up(s) require attention.`,
      action: "Prioritize urgent follow-ups before other activities.",
    });
  }

  if (dueToday > 0) {
    recommendations.push({
      priority: "MEDIUM",
      title: "Today's Schedule",
      description: `${dueToday} follow-up(s) are due today.`,
      action: "Complete today's scheduled follow-ups.",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: "LOW",
      title: "Everything is on track",
      description: "There are no urgent follow-up actions pending.",
      action: "Continue with planned customer engagement.",
    });
  }

  return {
    overdue,
    dueToday,
    upcoming,
    urgent,
    completedToday,

    // Will become dynamic after authentication integration
    assignedToMe: 0,

    recommendations,
  };
}

function startOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfTomorrow(): Date {
  const date = startOfToday();
  date.setDate(date.getDate() + 1);
  return date;
}