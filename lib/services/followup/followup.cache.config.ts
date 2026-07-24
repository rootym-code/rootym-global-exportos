import {
    FOLLOW_UP_CACHE_DEFAULT_TTL,
    FOLLOW_UP_CACHE_LONG_TTL,
    FOLLOW_UP_CACHE_MAX_KEYS,
    FOLLOW_UP_CACHE_SHORT_TTL,
  } from "./followup.cache.constants";
  
  export interface FollowUpCacheConfig {
    defaultTtl: number;
    shortTtl: number;
    longTtl: number;
    maxKeys: number;
    enabled: boolean;
  }
  
  class FollowUpCacheConfigService {
    private config: FollowUpCacheConfig = {
      defaultTtl:
        FOLLOW_UP_CACHE_DEFAULT_TTL,
  
      shortTtl:
        FOLLOW_UP_CACHE_SHORT_TTL,
  
      longTtl:
        FOLLOW_UP_CACHE_LONG_TTL,
  
      maxKeys:
        FOLLOW_UP_CACHE_MAX_KEYS,
  
      enabled: true,
    };
  
    get() {
      return {
        ...this.config,
      };
    }
  
    update(
      values: Partial<FollowUpCacheConfig>,
    ) {
      this.config = {
        ...this.config,
        ...values,
      };
  
      return this.get();
    }
  
    enable() {
      this.config.enabled = true;
    }
  
    disable() {
      this.config.enabled = false;
    }
  
    isEnabled() {
      return this.config.enabled;
    }
  
    reset() {
      this.config = {
        defaultTtl:
          FOLLOW_UP_CACHE_DEFAULT_TTL,
  
        shortTtl:
          FOLLOW_UP_CACHE_SHORT_TTL,
  
        longTtl:
          FOLLOW_UP_CACHE_LONG_TTL,
  
        maxKeys:
          FOLLOW_UP_CACHE_MAX_KEYS,
  
        enabled: true,
      };
  
      return this.get();
    }
  }
  
  const followUpCacheConfig =
    new FollowUpCacheConfigService();
  
  export default followUpCacheConfig;