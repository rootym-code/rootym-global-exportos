import type { WhatsAppSettings } from "./types";

export const DEFAULT_WHATSAPP_SETTINGS: WhatsAppSettings = {
  metaAppId: "",
  metaAppSecret: "",
  businessAccountId: "",
  phoneNumberId: "",
  accessToken: "",
  verifyToken: "",
};

export const WHATSAPP_SECTIONS = [
  {
    id: "meta-app",
    title: "Meta App",
    description:
      "Configure your Meta App credentials used by the WhatsApp Cloud API.",
  },
  {
    id: "business",
    title: "WhatsApp Business Account",
    description:
      "Configure your Business Account and Phone Number IDs.",
  },
  {
    id: "authentication",
    title: "Authentication",
    description:
      "Store your Access Token and Webhook Verify Token securely.",
  },
] as const;