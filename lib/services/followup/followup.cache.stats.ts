import followUpCache from "./followup.cache";

export interface FollowUpCacheStats {
  totalKeys: number;
  activeKeys: number;
  expiredKeys: number;
  hitRate: number;
  missRate: number;
}

export class FollowUpCacheStatsService {
  private hits = 0;

  private misses = 0;

  recordHit() {
    this.hits++;
  }

  recordMiss() {
    this.misses++;
  }

  reset() {
    this.hits = 0;
    this.misses = 0;
  }

  getStats(): FollowUpCacheStats {
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

    const totalRequests =
      this.hits + this.misses;

    return {
      totalKeys: keys.length,
      activeKeys,
      expiredKeys,
      hitRate:
        totalRequests === 0
          ? 0
          : Number(
              (
                (this.hits / totalRequests) *
                100
              ).toFixed(2),
            ),
      missRate:
        totalRequests === 0
          ? 0
          : Number(
              (
                (this.misses /
                  totalRequests) *
                100
              ).toFixed(2),
            ),
    };
  }
}

const followUpCacheStatsService =
  new FollowUpCacheStatsService();

export default followUpCacheStatsService;