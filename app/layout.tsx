import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
