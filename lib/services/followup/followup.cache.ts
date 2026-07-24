export interface FollowUpCache<T = unknown> {
    value: T;
    expiresAt: number;
  }
  
  export class FollowUpMemoryCache {
    private readonly cache = new Map<
      string,
      FollowUpCache
    >();
  
    get<T>(key: string): T | null {
      const item = this.cache.get(key);
  
      if (!item) {
        return null;
      }
  
      if (Date.now() > item.expiresAt) {
        this.cache.delete(key);
  
        return null;
      }
  
      return item.value as T;
    }
  
    set<T>(
      key: string,
      value: T,
      ttlSeconds = 300,
    ) {
      this.cache.set(key, {
        value,
        expiresAt:
          Date.now() + ttlSeconds * 1000,
      });
    }
  
    delete(key: string) {
      this.cache.delete(key);
    }
  
    clear() {
      this.cache.clear();
    }
  
    has(key: string) {
      return this.get(key) !== null;
    }
  
    keys() {
      return [...this.cache.keys()];
    }
  
    size() {
      return this.cache.size;
    }
  }
  
  const followUpCache =
    new FollowUpMemoryCache();
  
  export default followUpCache;