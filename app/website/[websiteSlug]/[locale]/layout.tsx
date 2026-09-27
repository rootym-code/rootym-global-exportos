/**
 * ============================================================
 * ROOTYM Public Customer Website Layout
 * ============================================================
 * Author: Prem Singh
 *
 * Purpose:
 *   Provides Website-wide tracking and verification injection
 *   for every public customer Website page.
 *
 * Applies to:
 *   - Homepage
 *   - Contact
 *   - Products
 *   - Product Detail
 *   - Request Quote
 *   - CMS pages
 *
 * Tracking / Verification:
 *   - Google Tag Manager
 *   - Google Analytics / Google Tag
 *   - Google Search Console
 *   - Meta Pixel
 *
 * IMPORTANT:
 *   This layout is intentionally located under:
 *
 *     app/website/[websiteSlug]/[locale]/layout.tsx
 *
 *   This is the actual public Customer Website route tree.
 *
 *   The previous layout under:
 *
 *     app/app/website/[websiteSlug]/[locale]/layout.tsx
 *
 *   is NOT part of this public route hierarchy.
 * ============================================================
 */

import type { Metadata } from "next";
import Script from "next/script";

import prisma from "@/lib/prisma";

/**
 * ============================================================
 * FORCE DYNAMIC
 * ============================================================
 *
 * Website tracking configuration is tenant-specific and must
 * always be resolved from the current database state.
 * ============================================================
 */

export const dynamic = "force-dynamic";

/**
 * ============================================================
 * ROUTE PROPS
 * ============================================================
 */

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    websiteSlug: string;
    locale: string;
  }>;
};

/**
 * ============================================================
 * WEBSITE TRACKING CONFIGURATION
 * ============================================================
 */

async function getWebsiteTrackingConfiguration(
  websiteSlug: string,
) {
  return prisma.website.findUnique({
    where: {
      slug: websiteSlug,
    },

    select: {
      id: true,
      name: true,
      isActive: true,

      configuration: {
        select: {
          websiteTitle: true,
          websiteDescription: true,

          gtmContainerId: true,
          googleAnalyticsMeasurementId: true,
          searchConsoleVerificationCode: true,
          metaPixelId: true,
        },
      },

      tenant: {
        select: {
          businessProfile: {
            select: {
              businessName: true,
              description: true,
            },
          },
        },
      },
    },
  });
}

/**
 * ============================================================
 * WEBSITE METADATA
 * ============================================================
 *
 * Search Console verification is emitted through Next.js
 * metadata so it appears in the document <head>.
 * ============================================================
 */

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { websiteSlug } = await params;

  const website =
    await getWebsiteTrackingConfiguration(websiteSlug);

  if (!website || !website.isActive) {
    return {};
  }

  const websiteTitle =
    website.configuration?.websiteTitle?.trim() ||
    website.tenant.businessProfile?.businessName?.trim() ||
    website.name;

  const websiteDescription =
    website.configuration?.websiteDescription?.trim() ||
    website.tenant.businessProfile?.description?.trim() ||
    undefined;

  const searchConsoleVerification =
    website.configuration?.searchConsoleVerificationCode?.trim();

  return {
    title: websiteTitle,
    description: websiteDescription,

    ...(searchConsoleVerification
      ? {
          verification: {
            google: searchConsoleVerification,
          },
        }
      : {}),
  };
}

/**
 * ============================================================
 * GOOGLE TAG MANAGER
 * ============================================================
 */

function GoogleTagManager({
  containerId,
}: {
  containerId: string;
}) {
  return (
    <>
      <Script
        id="rootym-google-tag-manager-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              "gtm.start": new Date().getTime(),
              event: "gtm.js"
            });
          `,
        }}
      />

      <Script
        id="rootym-google-tag-manager"
        src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(
          containerId,
        )}`}
        strategy="afterInteractive"
      />

      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(
            containerId,
          )}`}
          height="0"
          width="0"
          style={{
            display: "none",
            visibility: "hidden",
          }}
          title="Google Tag Manager"
        />
      </noscript>
    </>
  );
}

/**
 * ============================================================
 * GOOGLE ANALYTICS
 * ============================================================
 */

function GoogleAnalytics({
  measurementId,
}: {
  measurementId: string;
}) {
  return (
    <>
      <Script
        id="rootym-google-analytics-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
          measurementId,
        )}`}
        strategy="afterInteractive"
      />

      <Script
        id="rootym-google-analytics-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = window.gtag || gtag;

            gtag('js', new Date());
            gtag('config', '${measurementId}');
          `,
        }}
      />
    </>
  );
}

/**
 * ============================================================
 * META PIXEL
 * ============================================================
 */

function MetaPixel({
  pixelId,
}: {
  pixelId: string;
}) {
  return (
    <>
      <Script
        id="rootym-meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {
              if(f.fbq)return;
              n=f.fbq=function(){
                n.callMethod ?
                n.callMethod.apply(n,arguments) :
                n.queue.push(arguments)
              };

              if(!f._fbq)f._fbq=n;

              n.push=n;
              n.loaded=!0;
              n.version='2.0';
              n.queue=[];

              t=b.createElement(e);
              t.async=!0;
              t.src=v;

              s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)
            }(
              window,
              document,
              'script',
              'https://connect.facebook.net/en_US/fbevents.js'
            );

            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />

      <noscript>
        <img
          height="1"
          width="1"
          style={{
            display: "none",
          }}
          src={`https://www.facebook.com/tr?id=${encodeURIComponent(
            pixelId,
          )}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

/**
 * ============================================================
 * PUBLIC CUSTOMER WEBSITE LAYOUT
 * ============================================================
 */

export default async function CustomerWebsiteLocaleLayout({
  children,
  params,
}: LayoutProps) {
  const { websiteSlug } = await params;

  const website =
    await getWebsiteTrackingConfiguration(websiteSlug);

  /**
   * ------------------------------------------------------------
   * Website unavailable
   * ------------------------------------------------------------
   *
   * The individual public Website pages already perform their
   * own Website availability checks.
   *
   * Therefore this layout does not call notFound().
   * ------------------------------------------------------------
   */

  const configuration = website?.configuration;

  /**
   * ------------------------------------------------------------
   * Website-specific tracking configuration
   * ------------------------------------------------------------
   */

  const gtmContainerId =
    configuration?.gtmContainerId?.trim() || null;

  const googleAnalyticsMeasurementId =
    configuration?.googleAnalyticsMeasurementId?.trim() || null;

  const metaPixelId =
    configuration?.metaPixelId?.trim() || null;

  /**
   * ------------------------------------------------------------
   * Defensive validation
   * ------------------------------------------------------------
   */

  const validGtmContainerId =
    gtmContainerId &&
    /^GTM-[A-Z0-9]+$/i.test(gtmContainerId)
      ? gtmContainerId
      : null;

  const validGoogleAnalyticsId =
    googleAnalyticsMeasurementId &&
    /^G-[A-Z0-9]+$/i.test(
      googleAnalyticsMeasurementId,
    )
      ? googleAnalyticsMeasurementId
      : null;

  const validMetaPixelId =
    metaPixelId && /^\d+$/.test(metaPixelId)
      ? metaPixelId
      : null;

  /**
   * ------------------------------------------------------------
   * Temporary server diagnostic
   * ------------------------------------------------------------
   *
   * This confirms that the LIVE public route tree is executing
   * this layout and resolving the expected Website configuration.
   *
   * Once GTM is confirmed working, this diagnostic can be removed.
   * ------------------------------------------------------------
   */

  console.log("[ROOTYM PUBLIC TRACKING]", {
    websiteSlug,
    websiteId: website?.id ?? null,
    websiteName: website?.name ?? null,
    websiteActive: website?.isActive ?? null,
    configuredGtmContainerId:
      configuration?.gtmContainerId ?? null,
    effectiveGtmContainerId: validGtmContainerId,
    googleAnalyticsMeasurementId:
      configuration?.googleAnalyticsMeasurementId ?? null,
    metaPixelId:
      configuration?.metaPixelId ?? null,
  });

  return (
    <>
      {validGtmContainerId ? (
        <GoogleTagManager
          containerId={validGtmContainerId}
        />
      ) : null}

      {validGoogleAnalyticsId ? (
        <GoogleAnalytics
          measurementId={validGoogleAnalyticsId}
        />
      ) : null}

      {validMetaPixelId ? (
        <MetaPixel
          pixelId={validMetaPixelId}
        />
      ) : null}

      {children}
    </>
  );
}