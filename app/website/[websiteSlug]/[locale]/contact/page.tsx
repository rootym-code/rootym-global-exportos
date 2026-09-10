/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : Public Website
 * Feature     : Tenant Contact Page
 * Purpose     : Resolves a customer Website and renders the
 *               reusable Contact experience with tenant-specific
 *               business identity, contact information and
 *               Website-scoped products.
 * ============================================================
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TenantContactPage from "@/components/contact/TenantContactPage";

import prisma from "@/lib/prisma";
import { ProductStatus } from "@/lib/generated/prisma";
import { listProducts } from "@/lib/services/product.service";

type PageProps = {
  params: Promise<{
    websiteSlug: string;
    locale: string;
  }>;
};

async function getWebsite(websiteSlug: string) {
  return prisma.website.findUnique({
    where: {
      slug: websiteSlug,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
      branding: {
        select: {
          logoMedia: {
            select: {
              fileUrl: true,
            },
          },
          primaryColor: true,
          secondaryColor: true,
          accentColor: true,
          fontFamily: true,
        },
      },
      configuration: {
        select: {
          websiteTitle: true,
          tagline: true,
          websiteDescription: true,
        },
      },
      tenant: {
        select: {
          businessProfile: {
            select: {
              businessName: true,
              legalName: true,
              description: true,
            },
          },
          businessAddress: {
            select: {
              addressLine1: true,
              addressLine2: true,
              city: true,
              state: true,
              postalCode: true,
              country: true,
            },
          },
          businessContactCommunication: {
            select: {
              primaryEmail: true,
              primaryPhone: true,
              whatsapp: true,
              linkedinUrl: true,
              facebookUrl: true,
              instagramUrl: true,
              youtubeUrl: true,
            },
          },
        },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { websiteSlug } = await params;
  const website = await getWebsite(websiteSlug);

  if (!website || !website.isActive) {
    return {};
  }

  const businessName =
    website.tenant.businessProfile?.businessName?.trim() ||
    website.name;

  const legalName =
    website.tenant.businessProfile?.legalName?.trim() ||
    businessName;

  const title =
    website.configuration?.websiteTitle?.trim() ||
    businessName;

  const description =
    website.configuration?.websiteDescription?.trim() ||
    website.tenant.businessProfile?.description?.trim() ||
    `Contact ${businessName} for business enquiries, product sourcing, quotations and commercial partnerships.`;

  return {
    title: `Contact Us | ${title}`,
    description,
    keywords: [
      `Contact ${businessName}`,
      `${businessName} enquiries`,
      `${businessName} products`,
      `${businessName} quotation`,
      "Export enquiry",
      "Product sourcing",
      "International trade",
      legalName,
    ],
  };
}

export default async function CustomerWebsiteContactPage({
  params,
}: PageProps) {
  const { websiteSlug, locale } = await params;

  const website = await getWebsite(websiteSlug);

  if (!website || !website.isActive) {
    notFound();
  }

  const businessProfile = website.tenant.businessProfile;
  const businessAddress = website.tenant.businessAddress;
  const businessContact =
    website.tenant.businessContactCommunication;

  const companyName =
    businessProfile?.businessName?.trim() ||
    website.name;

  const address = [
    businessAddress?.addressLine1,
    businessAddress?.addressLine2,
    businessAddress?.city,
    businessAddress?.state,
    businessAddress?.postalCode,
    businessAddress?.country,
  ]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(", ");

  const { items: products } = await listProducts(website.id, {
    status: ProductStatus.PUBLISHED,
    page: 1,
    pageSize: 100,
  });

  const serializedProducts = products
    .filter((product) => product.id && product.name && product.slug)
    .map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
    }));

  const websiteBranding = {
    companyName,
    logoMediaUrl:
      website.branding?.logoMedia?.fileUrl ?? null,
    primaryColor:
      website.branding?.primaryColor ?? null,
    secondaryColor:
      website.branding?.secondaryColor ?? null,
    accentColor:
      website.branding?.accentColor ?? null,
    fontFamily:
      website.branding?.fontFamily ?? null,
  };

  const websiteProductsHref =
    `/website/${websiteSlug}/${locale}/products`;

  const requestQuoteHref =
    "#contact-form";

  return (
    <>
      <Navbar websiteBranding={websiteBranding} />

      <TenantContactPage
        companyName={companyName}
        products={serializedProducts}
        address={address}
        email={businessContact?.primaryEmail?.trim() || ""}
        phone={businessContact?.primaryPhone?.trim() || ""}
        whatsapp={businessContact?.whatsapp?.trim() || ""}
        quoteHref={requestQuoteHref}
        productsHref={websiteProductsHref}
        primaryColor={website.branding?.primaryColor}
        secondaryColor={website.branding?.secondaryColor}
        accentColor={website.branding?.accentColor}
      />

      <Footer
        websiteBranding={websiteBranding}
        websiteConfiguration={website.configuration}
        businessIdentity={{
          businessName:
            businessProfile?.businessName ?? null,
          legalName:
            businessProfile?.legalName ?? null,
        }}
        businessAddress={businessAddress}
        businessContactCommunication={businessContact}
      />
    </>
  );
}
