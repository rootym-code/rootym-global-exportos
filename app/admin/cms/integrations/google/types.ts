export interface GoogleSettings {
  ga4MeasurementId: string;
  gtmContainerId: string;
  searchConsoleVerification: string;
  businessProfileUrl: string;
  recaptchaSiteKey: string;
  recaptchaSecretKey: string;
}

export interface GoogleSettingsResponse {
  success: boolean;
  data: GoogleSettings;
}