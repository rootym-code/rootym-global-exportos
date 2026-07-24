import followUpCache from "./followup.cache";

export interface FollowUpCacheMetrics {
  totalKeys: number;
  activeKeys: number;
  expiredKeys: number;
}

export class FollowUpCacheMetricsService {
  getMetrics(): FollowUpCacheMetrics {
    const keys = followUpCache.keys();

    let activeKeys = 0;
    let expiredKeys = 0;

    for (const key of keys) {
      if (followUpCache.has(key)) {
        activeKeys++;
      } else {
        expiredKeys++;
      }
    }

    return {
      totalKeys: keys.length,
      activeKeys,
      expiredKeys,
    };
  }

  getKeys() {
    return followUpCache.keys();
  }

  clearExpired() {
    const keys = followUpCache.keys();

    let removed = 0;

    for (const key of keys) {
      if (!followUpCache.has(key)) {
        followUpCache.delete(key);
        removed++;
      }
    }

    return removed;
  }
}

const followUpCacheMetricsService =
  new FollowUpCacheMetricsService();

export default followUpCacheMetricsService;