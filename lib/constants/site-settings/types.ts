/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : CMS Settings
 * Feature         : Shared Settings Types
 * ============================================================
 */

export interface SiteSettingItem {
    key: string;
    label: string;
    value: string;
  }
  
  export interface SaveSiteSettingItem {
    key: string;
    value: string;
  }
  
  export interface SettingsSectionProps<T> {
    values: T;
    onChange: (field: keyof T, value: string) => void;
    loading?: boolean;
  }