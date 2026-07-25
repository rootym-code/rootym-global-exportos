import type { GoogleSettings } from "./types";

export const DEFAULT_GOOGLE_SETTINGS: GoogleSettings = {
  ga4MeasurementId: "",
  gtmContainerId: "",
  searchConsoleVerification: "",
  businessProfileUrl: "",
  recaptchaSiteKey: "",
  recaptchaSecretKey: "",
};

export const GOOGLE_SECTIONS = [
  {
    id: "analytics",
    title: "Google Analytics 4",
    description:
      "Track website traffic, user behavior and conversion events.",
  },
  {
    id: "tag-manager",
    title: "Google Tag Manager",
    description:
      "Manage marketing and analytics tags without changing code.",
  },
  {
    id: "search-console",
    title: "Google Search Console",
    description:
      "Verify website ownership and monitor search performance.",
  },
  {
    id: "business-profile",
    title: "Google Business Profile",
    description:
      "Display and manage your official Google Business Profile.",
  },
  {
    id: "recaptcha",
    title: "Google reCAPTCHA",
    description:
      "Protect inquiry and contact forms from spam submissions.",
  },
] as const;