import followUpCache from "./followup.cache";

export interface FollowUpCacheHealth {
  status: "healthy" | "warning";
  totalKeys: number;
  activeKeys: number;
  expiredKeys: number;
  memoryUsage: number;
}

export class FollowUpCacheHealthService {
  getHealth(): FollowUpCacheHealth {
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
      status:
        expiredKeys === 0
          ? "healthy"
          : "warning",
      totalKeys: keys.length,
      activeKeys,
      expiredKeys,
      memoryUsage: this.calculateMemoryUsage(
        keys,
      ),
    };
  }

  isHealthy() {
    return (
      this.getHealth().status ===
      "healthy"
    );
  }

  private calculateMemoryUsage(
    keys: string[],
  ): number {
    let bytes = 0;

    for (const key of keys) {
      bytes += key.length * 2;
    }

    return bytes;
  }
}

const followUpCacheHealthService =
  new FollowUpCacheHealthService();

export default followUpCacheHealthService;