export const FOLLOW_UP_CACHE_DEFAULT_TTL = 300;

export const FOLLOW_UP_CACHE_SHORT_TTL = 60;

export const FOLLOW_UP_CACHE_LONG_TTL = 900;

export const FOLLOW_UP_CACHE_MAX_KEYS = 1000;

export const FOLLOW_UP_CACHE_PREFIX =
  "followup";

export const FOLLOW_UP_CACHE_SEPARATOR =
  ":";

export const FOLLOW_UP_CACHE_TAGS = {
  DASHBOARD: "dashboard",

  FOLLOWUP: "followup",

  INQUIRY: "inquiry",

  PENDING: "pending",

  TODAY: "today",

  UPCOMING: "upcoming",

  OVERDUE: "overdue",

  ASSIGNED: "assigned",

  SEARCH: "search",

  STATS: "stats",

  REPORTS: "reports",

  ANALYTICS: "analytics",

  ARCHIVE: "archive",
} as const;

export type FollowUpCacheTag =
  (typeof FOLLOW_UP_CACHE_TAGS)[keyof typeof FOLLOW_UP_CACHE_TAGS];