/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : Application Layout
 * Feature     : Global Metadata & Localization
 * Purpose     : Provides the global application layout,
 *               localization, typography and CMS-managed
 *               company metadata.
 * ============================================================
 */

import type { Metadata, Viewport } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import { headers } from "next/headers";

import PublicFloatingProvider from "@/components/r-captain/floating/PublicFloatingProvider";

import { TranslationProvider } from "@/lib/i18n/context";

import { getDictionary } from "@/lib/i18n/get-dictionary";

import { Locale } from "@/lib/i18n/config";

import siteSettingService from "@/lib/services/cms/site-setting.service";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * ============================================================
 * Global Metadata
 * ============================================================
 *
 * Company identity is resolved from CMS so that changes to
 * Company Name and Legal Company Name are reflected across
 * the public website metadata.
 * ============================================================
 */

export async function generateMetadata(): Promise<Metadata> {
  const settings =
    await siteSettingService.getCompanySettings();

  const companyName =
    settings.company.companyName.trim() || "ROOTYM";

  const legalName =
    settings.company.legalName.trim() || companyName;

  const tagline =
    settings.company.tagline.trim() ||
    "Rooted in India. Trusted Worldwide.";

  const description =
    settings.company.description.trim() ||
    `${companyName} exports premium Indian agricultural products to global markets.`;

  return {
    metadataBase: new URL(
      "https://www.rootym.in"
    ),

    title: {
      default: `${companyName} | ${tagline}`,
      template: `%s | ${companyName}`,
    },

    description,

    applicationName: companyName,

    keywords: [
      companyName,
      legalName,
      "Indian Exporter",
      "Agricultural Export",
      "Makhana",
      "Onion",
      "Pomegranate",
    ],

    openGraph: {
      type: "website",
      siteName: companyName,
      title: `${companyName} | ${tagline}`,
      description,
    },

    twitter: {
      card: "summary_large_image",
      title: companyName,
      description,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#2E7D32",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();

  const locale = (headersList.get("x-locale") ||
    "en") as Locale;

  // console.log(
  //   "x-locale header =",
  //   headersList.get("x-locale")
  // );

  // console.log(
  //   "resolved locale =",
  //   locale
  // );

  const direction =
    locale === "ar" ? "rtl" : "ltr";

  const dictionary =
    await getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <TranslationProvider
          locale={locale}
          direction={direction}
          dictionary={dictionary}
        >
          <PublicFloatingProvider>
            {children}
          </PublicFloatingProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}