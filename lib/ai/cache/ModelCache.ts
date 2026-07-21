/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : AI Cache
 * Component       : ModelCache
 *
 * Description
 * ------------------------------------------------------------
 * In-memory cache for discovered Gemini models.
 *
 * Responsibilities:
 * • Store discovered models
 * • Validate cache expiry
 * • Provide cache age
 * ============================================================
 */

class ModelCache {
    private models: string[] = [];
  
    private updatedAt: number | null = null;
  
    private readonly cacheDurationMs =
      24 * 60 * 60 * 1000;
  
    setModels(models: string[]) {
      this.models = models;
  
      this.updatedAt = Date.now();
    }
  
    getModels(): string[] {
      return this.models;
    }
  
    isValid(): boolean {
      if (!this.updatedAt) {
        return false;
      }
  
      return (
        Date.now() - this.updatedAt <
        this.cacheDurationMs
      );
    }
  
    getAgeMinutes(): number {
      if (!this.updatedAt) {
        return 0;
      }
  
      return Math.floor(
        (Date.now() - this.updatedAt) /
          (1000 * 60)
      );
    }
  
    clear() {
      this.models = [];
  
      this.updatedAt = null;
    }
  }
  
  const modelCache = new ModelCache();
  
  export default modelCache;