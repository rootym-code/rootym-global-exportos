export const FollowUpCacheKeys = {
    all: () => "followups",
  
    dashboard: () => "followups:dashboard",
  
    stats: () => "followups:stats",
  
    pending: () => "followups:pending",
  
    overdue: () => "followups:overdue",
  
    today: () => "followups:today",
  
    upcoming: () => "followups:upcoming",
  
    archived: () => "followups:archived",
  
    inquiry: (inquiryId: string) =>
      `followups:inquiry:${inquiryId}`,
  
    followUp: (id: string) =>
      `followups:${id}`,
  
    assigned: (adminId: string) =>
      `followups:assigned:${adminId}`,
  
    search: (query: string) =>
      `followups:search:${query}`,
  
    page: (
      page: number,
      limit: number,
    ) =>
      `followups:page:${page}:limit:${limit}`,
  } as const;
  
  export default FollowUpCacheKeys;