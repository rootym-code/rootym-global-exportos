import { notFound } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import cmsPageService from "@/lib/services/cms/page.service";
import {
  CmsPageLayout,
  CmsPageStatus,
  CmsPageTemplate,
} from "@/lib/generated/prisma";

import type {
  CmsLandingPageContent,
  LandingPageSection,
} from "@/components/admin/cms/pages/types";

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

function SectionHeader({
  eyebrow,
  heading,
  description,
  light = false,
}: {
  eyebrow?: string;
  heading: string;
  description?: string;
  light?: boolean;
}) {
  return (
    <div className={light ? "max-w-3xl mx-auto text-center" : "max-w-3xl"}>
      {eyebrow && (
        <p
          className={
            light
              ? "mb-4 text-sm font-bold uppercase tracking-[0.18em] text-green-100"
              : "mb-4 text-sm font-bold uppercase tracking-[0.18em] text-green-700"
          }
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={
          light
            ? "text-3xl font-bold tracking-tight text-white md:text-5xl"
            : "text-3xl font-bold tracking-tight text-gray-950 md:text-5xl"
        }
      >
        {heading}
      </h2>
      {description && (
        <p
          className={
            light
              ? "mt-5 max-w-2xl text-lg leading-8 text-green-50 mx-auto"
              : "mt-5 max-w-2xl text-lg leading-8 text-gray-600"
          }
        >
          {description}
        </p>
      )}
    </div>
  );
}

function getCtaHref(text: string, locale: string): string {
  if (!text) return `/${locale}`;
  const lower = text.trim().toLowerCase();
  if (lower.includes("quote")) {
    return `/${locale}/request-quote`;
  }
  if (lower.includes("contact") || lower.includes("rootym")) {
    return `/${locale}/contact`;
  }
  return `/${locale}`;
}

function getSpecificationHref(productName: string): string | null {
  const product = productName.trim().toLowerCase();

  if (product.includes("n-53") && product.includes("nashik") && product.includes("onion")) {
    return "/downloads/ROOTYM_N53_Nashik_Onion_Buyer_Specification_Sheet.pdf";
  }

  if (product.includes("dehydrated") && product.includes("onion") && product.includes("flake")) {
    return "/downloads/ROOTYM_Dehydrated_Onion_Flakes_Buyer_Specification_Sheet.pdf";
  }

  return null;
}

function renderSection(section: LandingPageSection, index: number, locale: string) {
  switch (section.type) {
    case "hero":
      return (
        <section
          key={`hero-${index}`}
          className="relative overflow-hidden bg-white px-6 py-16 md:py-24 lg:py-28"
        >
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-green-100/60 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-lime-100/50 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-800 ring-1 ring-green-200">
                ROOTYM Global Market
              </span>

              <h1 className="mt-7 max-w-5xl text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-gray-950 sm:text-5xl md:text-6xl lg:text-7xl">
                {section.heading}
              </h1>

              {section.subheading && (
                <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
                  {section.subheading}
                </p>
              )}

              {(section.primaryCtaText || section.secondaryCtaText) && (
                <div className="mt-9 flex flex-wrap gap-4">
{section.primaryCtaText && (
  <Link
    href={getCtaHref(section.primaryCtaText, locale)}
    className="rounded-xl bg-green-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-green-900/10 transition hover:bg-green-800"
  >
    {section.primaryCtaText}
  </Link>
)}


{section.secondaryCtaText && (
  <Link
    href={getCtaHref(section.secondaryCtaText, locale)}
    className="rounded-xl border border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-900 shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
  >
    {section.secondaryCtaText}
  </Link>
)}
                </div>
              )}
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="rounded-[2rem] bg-gray-950 p-3 shadow-2xl shadow-gray-900/15">
                <div className="rounded-[1.5rem] bg-gradient-to-br from-green-700 via-green-800 to-gray-950 p-7 text-white md:p-9">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-green-100">
                      ROOTYM
                    </span>
                    <span className="rounded-full border border-white/20 px-3 py-1 text-xs text-green-50">
                      Global Market
                    </span>
                  </div>

                  <div className="mt-16">
                    <p className="text-sm font-medium text-green-100">
                      Rooted in India.
                    </p>
                    <p className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                      Trusted Worldwide.
                    </p>
                  </div>

                  <div className="mt-12 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                      <p className="text-xs uppercase tracking-wide text-green-100">
                        Sourcing
                      </p>
                      <p className="mt-1 font-semibold">India</p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                      <p className="text-xs uppercase tracking-wide text-green-100">
                        Focus
                      </p>
                      <p className="mt-1 font-semibold">Global Trade</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-white px-5 py-4 shadow-xl ring-1 ring-gray-100 sm:block">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Export
                </p>
                <p className="mt-1 font-bold text-gray-950">From India</p>
              </div>
            </div>
          </div>
        </section>
      );

    case "valueProposition": {
      const pointsCount = section.points.length;
      return (
        <section
          key={`value-proposition-${index}`}
          className="bg-gray-50 px-6 py-16 md:py-20"
        >
          <div className="mx-auto max-w-7xl">
            {pointsCount === 1 ? (
              <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                <SectionHeader
                  eyebrow="Why ROOTYM"
                  heading={section.heading}
                  description={section.description}
                />
                <div className="group rounded-3xl bg-white p-8 shadow-md ring-1 ring-green-100/50 transition hover:shadow-lg md:p-10">
                  <div className="flex gap-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-lg font-bold text-green-800">
                      ✓
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-950">Key Advantage</h3>
                      <p className="mt-3 text-lg leading-relaxed text-gray-700 font-medium">
                        {section.points[0]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <SectionHeader
                  eyebrow="Why ROOTYM"
                  heading={section.heading}
                  description={section.description}
                />

                {pointsCount > 0 && (
                  <div
                    className={
                      pointsCount === 2
                        ? "mt-12 grid gap-6 md:grid-cols-2"
                        : pointsCount === 3
                        ? "mt-12 grid gap-6 md:grid-cols-3"
                        : "mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    }
                  >
                    {section.points.map((point, pointIndex) => (
                      <div
                        key={`${point}-${pointIndex}`}
                        className="group rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-lg md:p-8"
                      >
                        <div className="flex items-start gap-5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800">
                            {pointIndex + 1}
                          </div>
                          <p className="pt-1 text-base font-semibold leading-7 text-gray-900">
                            {point}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      );
    }

    case "product":
      return (
        <section
          key={`product-${index}`}
          className="bg-white px-6 py-16 md:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Product"
              heading={section.heading}
              description={section.description}
            />

            <div className="mt-12 overflow-hidden rounded-[2rem] bg-gray-950 shadow-xl">
              <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative flex min-h-[14rem] flex-col justify-end overflow-hidden bg-gradient-to-br from-gray-950 via-green-950 to-green-800 p-8 text-white md:p-10 lg:min-h-[18rem]">
                  <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-green-500/20 blur-2xl" />
                  <p className="relative text-sm font-bold uppercase tracking-[0.18em] text-green-200">
                    Product
                  </p>
                  <h3 className="relative mt-3 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
                    {section.productName}
                  </h3>
                </div>

                <div className="grid bg-gray-200 sm:grid-cols-2 gap-px">
                  {[
                    ["Origin", section.origin],
                    ["Form", section.form],
                    ["Packaging", section.packaging],
                    ["MOQ", section.moq],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="bg-white p-6 md:p-7"
                    >
                      <p className="text-sm font-medium text-gray-500">{label}</p>
                      <p className="mt-2 text-lg font-bold text-gray-950">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {section.applications.length > 0 && (
                <div className="border-t border-gray-800 bg-gray-950 p-6 md:p-8 text-white">
                  <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-green-200">
                    Applications
                  </h4>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {section.applications.map((application, applicationIndex) => (
                      <span
                        key={`${application}-${applicationIndex}`}
                        className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/20"
                      >
                        {application}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {(() => {
              const specificationHref = getSpecificationHref(section.productName);

              if (!specificationHref) return null;

              return (
                <div className="border-t border-white/10 bg-gray-950 px-8 py-7 md:px-10">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-bold text-white">
                        Buyer Specification Sheet
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-300">
                        Download the ROOTYM Buyer Specification & Laboratory Analysis Sheet
                        for detailed product information.
                      </p>
                    </div>

                    <a
                      href={specificationHref}
                      download
                      className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-3 font-semibold text-green-800 shadow-lg transition hover:bg-green-50"
                    >
                      Download Specification
                    </a>
                  </div>
                </div>
              );
            })()}


          </div>
        </section>
      );

    case "applications": {
      const itemsCount = section.items.length;
      return (
        <section
          key={`applications-${index}`}
          className="bg-gray-50 px-6 py-16 md:py-20"
        >
          <div className="mx-auto max-w-7xl">
            {itemsCount === 1 ? (
              <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                <SectionHeader
                  eyebrow="Applications"
                  heading={section.heading}
                  description={section.description}
                />
                <div className="rounded-3xl bg-white p-8 shadow-md ring-1 ring-gray-100 md:p-10">
                  <div className="flex items-start gap-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-800">
                      01
                    </span>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-950">
                        {section.items[0].title}
                      </h3>
                      {section.items[0].description && (
                        <p className="mt-4 text-lg leading-relaxed text-gray-600">
                          {section.items[0].description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <SectionHeader
                  eyebrow="Applications"
                  heading={section.heading}
                  description={section.description}
                />

                {itemsCount > 0 && (
                  <div
                    className={
                      itemsCount === 2
                        ? "mt-12 grid gap-6 md:grid-cols-2"
                        : itemsCount === 3
                        ? "mt-12 grid gap-6 md:grid-cols-3"
                        : "mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    }
                  >
                    {section.items.map((item, itemIndex) => (
                      <div
                        key={`${item.title}-${itemIndex}`}
                        className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gray-100 md:p-8 transition hover:shadow-md hover:border-green-100"
                      >
                        <div className="flex items-start gap-4">
                          <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-800">
                            {String(itemIndex + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <h3 className="text-xl font-bold text-gray-950">
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="mt-3 leading-7 text-gray-600">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      );
    }

    case "whyRootym": {
      const pointsCount = section.points.length;
      return (
        <section
          key={`why-rootym-${index}`}
          className="bg-white px-6 py-16 md:py-20"
        >
          <div className="mx-auto max-w-7xl">
            {pointsCount === 1 ? (
              <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                <SectionHeader eyebrow="The ROOTYM Difference" heading={section.heading} />
                <div className="rounded-3xl border border-green-200 bg-green-50/10 p-8 shadow-md md:p-10 transition hover:shadow-lg">
                  <span className="text-base font-bold text-green-700">01</span>
                  <h3 className="mt-4 text-2xl font-bold text-gray-950">
                    {section.points[0].title}
                  </h3>
                  {section.points[0].description && (
                    <p className="mt-4 text-lg leading-relaxed text-gray-600">
                      {section.points[0].description}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <>
                <SectionHeader eyebrow="The ROOTYM Difference" heading={section.heading} />

                {pointsCount > 0 && (
                  <div
                    className={
                      pointsCount === 2
                        ? "mt-12 grid gap-6 md:grid-cols-2"
                        : pointsCount === 3
                        ? "mt-12 grid gap-6 md:grid-cols-3"
                        : "mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    }
                  >
                    {section.points.map((point, pointIndex) => (
                      <div
                        key={`${point.title}-${pointIndex}`}
                        className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition hover:shadow-md hover:border-green-100 md:p-8"
                      >
                        <span className="text-sm font-bold text-green-700">
                          0{pointIndex + 1}
                        </span>
                        <h3 className="mt-4 text-xl font-bold text-gray-950">
                          {point.title}
                        </h3>
                        {point.description && (
                          <p className="mt-3 leading-7 text-gray-600">
                            {point.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      );
    }

    case "buyerFocus": {
      const buyerCount = section.buyerTypes.length;
      return (
        <section
          key={`buyer-focus-${index}`}
          className="bg-gray-50 px-6 py-16 md:py-20"
        >
          <div className="mx-auto max-w-7xl">
            {buyerCount === 1 ? (
              <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                <SectionHeader
                  eyebrow="Buyer Focus"
                  heading={section.heading}
                  description={section.description}
                />
                <div className="rounded-3xl bg-white p-8 shadow-md ring-1 ring-green-100/50 md:p-10 flex items-center gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-700">Target Segment</p>
                    <p className="mt-1 text-2xl font-extrabold text-gray-950">{section.buyerTypes[0]}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <SectionHeader
                  eyebrow="Buyer Focus"
                  heading={section.heading}
                  description={section.description}
                />

                {buyerCount > 0 && (
                  <div
                    className={
                      buyerCount === 2
                        ? "mt-12 grid gap-4 md:grid-cols-2"
                        : buyerCount === 3
                        ? "mt-12 grid gap-4 md:grid-cols-3"
                        : "mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    }
                  >
                    {section.buyerTypes.map((buyerType, buyerIndex) => (
                      <div
                        key={`${buyerType}-${buyerIndex}`}
                        className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md hover:ring-green-100"
                      >
                        <p className="font-bold text-gray-950">{buyerType}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      );
    }

    case "packaging": {
      const pkgCount = section.options.length;
      return (
        <section
          key={`packaging-${index}`}
          className="bg-white px-6 py-16 md:py-20"
        >
          <div className="mx-auto max-w-7xl">
            {pkgCount === 1 ? (
              <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                <SectionHeader
                  eyebrow="Packaging"
                  heading={section.heading}
                  description={section.description}
                />
                <div className="rounded-[2rem] border-2 border-dashed border-green-200 bg-green-50/10 p-8 md:p-10 shadow-sm transition hover:bg-green-50/20">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800 uppercase tracking-wider">
                    Standard Packaging Option
                  </span>
                  <p className="mt-6 text-2xl font-extrabold leading-snug text-gray-950">
                    {section.options[0]}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <SectionHeader
                  eyebrow="Packaging"
                  heading={section.heading}
                  description={section.description}
                />

                {pkgCount > 0 && (
                  <div
                    className={
                      pkgCount === 2
                        ? "mt-12 grid gap-5 md:grid-cols-2"
                        : pkgCount === 3
                        ? "mt-12 grid gap-5 md:grid-cols-3"
                        : "mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
                    }
                  >
                    {section.options.map((option, optionIndex) => (
                      <div
                        key={`${option}-${optionIndex}`}
                        className="rounded-3xl border border-gray-200 bg-gray-50 p-7 transition hover:border-green-200 hover:bg-green-50/40"
                      >
                        <span className="text-sm font-bold text-green-700">
                          Option {optionIndex + 1}
                        </span>
                        <p className="mt-3 text-lg font-bold text-gray-950">
                          {option}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      );
    }

    case "exportDocuments": {
      const docCount = section.documents.length;
      return (
        <section
          key={`export-documents-${index}`}
          className="bg-gray-50 px-6 py-16 md:py-20"
        >
          <div className="mx-auto max-w-7xl">
            {docCount === 1 ? (
              <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
                <SectionHeader
                  eyebrow="Export Support"
                  heading={section.heading}
                  description={section.description}
                />
                <div className="flex items-center gap-5 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-green-100/50 md:p-10">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700 text-xl">
                    ✓
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-700">Verified Export Document</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{section.documents[0]}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <SectionHeader
                  eyebrow="Export Support"
                  heading={section.heading}
                  description={section.description}
                />

                {docCount > 0 && (
                  <div
                    className={
                      docCount === 2
                        ? "mt-12 grid gap-4 md:grid-cols-2"
                        : docCount === 3
                        ? "mt-12 grid gap-4 md:grid-cols-3"
                        : "mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                    }
                  >
                    {section.documents.map((document, documentIndex) => (
                      <div
                        key={`${document}-${documentIndex}`}
                        className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md hover:ring-green-100"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                          ✓
                        </div>
                        <p className="font-semibold text-gray-900">{document}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      );
    }

    case "cta":
      return (
        <section
          key={`cta-${index}`}
          className="relative overflow-hidden bg-green-800 px-6 py-16 md:py-20 text-white"
        >
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-green-950/30 blur-3xl" />

          <div className="relative mx-auto max-w-5xl text-center flex flex-col items-center">
            <SectionHeader
              heading={section.heading}
              description={section.description}
              light
            />

            {(section.primaryCtaText || section.secondaryCtaText) && (
              <div className="mt-9 flex flex-wrap justify-center gap-4">
{section.primaryCtaText && (
  <Link
    href={getCtaHref(section.primaryCtaText, locale)}
    className="rounded-xl bg-white px-6 py-3.5 font-semibold text-green-800 shadow-lg transition hover:bg-green-50"
  >
    {section.primaryCtaText}
  </Link>
)}

{section.secondaryCtaText && (
  <Link
    href={getCtaHref(section.secondaryCtaText, locale)}
    className="rounded-xl border border-green-200/70 bg-transparent px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
  >
    {section.secondaryCtaText}
  </Link>
)}
              </div>
            )}
          </div>
        </section>
      );

    case "faq":
      return (
        <section
          key={`faq-${index}`}
          className="bg-white px-6 py-16 md:py-20"
        >
          <div className="mx-auto max-w-5xl">
            <SectionHeader eyebrow="FAQ" heading={section.heading} />

            {section.items.length > 0 && (
              <div className="mt-12 space-y-4">
                {section.items.map((item, itemIndex) => (
                  <details
                    key={`${item.question}-${itemIndex}`}
                    className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <summary className="cursor-pointer list-none pr-8 font-bold text-gray-950 marker:hidden">
                      <div className="flex items-start justify-between gap-6">
                        <span>{item.question}</span>
                        <span className="shrink-0 text-xl font-normal text-green-700 transition group-open:rotate-45">
                          +
                        </span>
                      </div>
                    </summary>

                    {item.answer && (
                      <p className="mt-4 max-w-3xl leading-7 text-gray-600">
                        {item.answer}
                      </p>
                    )}
                  </details>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    default:
      return null;
  }
}

export default async function CmsPage({
  params,
}: PageProps) {
  const { locale, slug } = await params;

  const page = await cmsPageService.getBySlug(slug);

  if (!page) {
    notFound();
  }

  if (page.status !== CmsPageStatus.PUBLISHED) {
    notFound();
  }

  const translation = page.translations.find(
    (item) =>
      item.language.code.toLowerCase() === locale.toLowerCase()
  );

  if (!translation || !translation.isPublished) {
    notFound();
  }

  const isWebsiteLayout =
    page.layout === CmsPageLayout.WEBSITE;

  const isCountryLanding =
    page.template === CmsPageTemplate.COUNTRY_LANDING;

  const structuredContent =
    translation.structuredContent as CmsLandingPageContent | null;

  const pageContent = isCountryLanding ? (
    structuredContent?.sections?.length ? (
      <main className="overflow-x-hidden bg-white">
        {structuredContent.sections.map((section, index) =>
    renderSection(section, index, locale)
        )}
      </main>
    ) : (
      <main className="overflow-x-hidden bg-white">
        <section className="bg-white px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl">
            <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
              ROOTYM Global Market
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              {translation.title}
            </h1>

            {translation.excerpt && (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
                {translation.excerpt}
              </p>
            )}
          </div>
        </section>

        {translation.content && (
          <section className="bg-gray-50 px-6 py-12">
            <div className="mx-auto max-w-6xl">
              <article className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
                <div className="whitespace-pre-wrap text-base leading-8 text-gray-700">
                  {translation.content}
                </div>
              </article>
            </div>
          </section>
        )}
      </main>
    )
  ) : (
    <main className="overflow-x-hidden bg-white">
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          {translation.title}
        </h1>

        {translation.excerpt && (
          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            {translation.excerpt}
          </p>
        )}

        {translation.content && (
          <article className="mt-10">
            <div className="whitespace-pre-wrap text-base leading-8 text-gray-700">
              {translation.content}
            </div>
          </article>
        )}
      </section>
    </main>
  );

  if (isWebsiteLayout) {
    return (
      <>
        <Navbar />

        {pageContent}

        <Footer />
      </>
    );
  }

  return pageContent;
}