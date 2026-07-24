export interface FollowUpCacheEntry<T = unknown> {
    value: T;
    expiresAt: number;
  }
  
  export interface FollowUpCacheOptions {
    ttl?: number;
  }
  
  export interface FollowUpCacheSummary {
    totalKeys: number;
    activeKeys: number;
    expiredKeys: number;
  }
  
  export interface FollowUpCacheStore {
    get<T>(key: string): T | null;
  
    set<T>(
      key: string,
      value: T,
      ttlSeconds?: number,
    ): void;
  
    has(key: string): boolean;
  
    delete(key: string): void;
  
    clear(): void;
  
    keys(): string[];
  }