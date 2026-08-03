export const locales = ["en", "ar", "si"] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية (Arabic)",
  si: "සිංහල (Sinhala)",
};

export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
  si: "ltr",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
