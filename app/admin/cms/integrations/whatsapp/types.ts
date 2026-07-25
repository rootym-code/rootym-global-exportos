export interface WhatsAppSettings {
    metaAppId: string;
    metaAppSecret: string;
    businessAccountId: string;
    phoneNumberId: string;
    accessToken: string;
    verifyToken: string;
  }
  
  export interface WhatsAppSettingsResponse {
    success: boolean;
    data: WhatsAppSettings;
  }