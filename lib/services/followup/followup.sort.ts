import {
    FollowUpPriority,
  } from "@/lib/generated/prisma";
  
  export function compareFollowUpPriority(
    a: FollowUpPriority,
    b: FollowUpPriority,
  ) {
    const order: Record<FollowUpPriority, number> = {
      URGENT: 4,
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1,
    };
  
    return order[b] - order[a];
  }
  
  export function compareFollowUpDate(
    a: Date,
    b: Date,
  ) {
    return a.getTime() - b.getTime();
  }
  
  export function sortFollowUps<
    T extends {
      priority: FollowUpPriority;
      scheduledAt: Date;
    },
  >(items: T[]) {
    return [...items].sort((a, b) => {
      const priority = compareFollowUpPriority(
        a.priority,
        b.priority,
      );
  
      if (priority !== 0) {
        return priority;
      }
  
      return compareFollowUpDate(
        a.scheduledAt,
        b.scheduledAt,
      );
    });
  }
  
  export function sortNewestFirst<
    T extends {
      createdAt: Date;
    },
  >(items: T[]) {
    return [...items].sort(
      (a, b) =>
        b.createdAt.getTime() -
        a.createdAt.getTime(),
    );
  }
  
  export function sortOldestFirst<
    T extends {
      createdAt: Date;
    },
  >(items: T[]) {
    return [...items].sort(
      (a, b) =>
        a.createdAt.getTime() -
        b.createdAt.getTime(),
    );
  }