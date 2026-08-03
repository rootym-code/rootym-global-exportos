import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";

import PublicFloatingProvider from "@/components/r-captain/floating/PublicFloatingProvider";
import { TranslationProvider } from "@/lib/i18n/context";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { Locale } from "@/lib/i18n/config";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rootym.in"),
  title: {
    default: "ROOTYM | Rooted in India. Trusted Worldwide.",
    template: "%s | ROOTYM",
  },
  description:
    "ROOTYM AGRO HARVEST PRIVATE LIMITED exports premium Indian agricultural products to global markets.",
  applicationName: "ROOTYM",
  keywords: [
    "ROOTYM",
    "Indian Exporter",
    "Agricultural Export",
    "Makhana",
    "Onion",
    "Pomegranate",
  ],
  openGraph: {
    type: "website",
    siteName: "ROOTYM",
    title: "ROOTYM | Rooted in India. Trusted Worldwide.",
    description:
      "Premium Indian agricultural exports for global buyers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROOTYM",
    description:
      "Premium Indian agricultural exports for global buyers.",
  },
};

export const viewport: Viewport = {
  themeColor: "#2E7D32",
  colorScheme: "light",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers();
  const locale = (headersList.get("x-locale") || "en") as Locale;
//  console.log("x-locale header =", headersList.get("x-locale"));
 // console.log("resolved locale =", locale);


  const direction = locale === "ar" ? "rtl" : "ltr";
  const dictionary = await getDictionary(locale);

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
