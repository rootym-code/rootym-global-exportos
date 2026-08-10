import { notFound } from "next/navigation";

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
    <div className="max-w-3xl">
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
              ? "mt-5 max-w-2xl text-lg leading-8 text-green-50"
              : "mt-5 max-w-2xl text-lg leading-8 text-gray-600"
          }
        >
          {description}
        </p>
      )}
    </div>
  );
}

function renderSection(section: LandingPageSection, index: number) {
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
                    <button
                      type="button"
                      className="rounded-xl bg-green-700 px-6 py-3.5 font-semibold text-white shadow-lg shadow-green-900/10 transition hover:bg-green-800"
                    >
                      {section.primaryCtaText}
                    </button>
                  )}

                  {section.secondaryCtaText && (
                    <button
                      type="button"
                      className="rounded-xl border border-gray-300 bg-white px-6 py-3.5 font-semibold text-gray-900 shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
                    >
                      {section.secondaryCtaText}
                    </button>
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

    case "valueProposition":
      return (
        <section
          key={`value-proposition-${index}`}
          className="bg-gray-50 px-6 py-20 md:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Why ROOTYM"
              heading={section.heading}
              description={section.description}
            />

            {section.points.length > 0 && (
              <div className="mt-12 grid gap-5 md:grid-cols-2">
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
          </div>
        </section>
      );

    case "product":
      return (
        <section
          key={`product-${index}`}
          className="bg-white px-6 py-20 md:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Product"
              heading={section.heading}
              description={section.description}
            />

            <div className="mt-12 overflow-hidden rounded-[2rem] bg-gray-950 shadow-xl">
              <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative flex min-h-72 flex-col justify-end overflow-hidden bg-gradient-to-br from-gray-950 via-green-950 to-green-800 p-8 text-white md:p-10 lg:min-h-[25rem]">
                  <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-green-500/20 blur-2xl" />
                  <p className="relative text-sm font-bold uppercase tracking-[0.18em] text-green-200">
                    Product
                  </p>
                  <h3 className="relative mt-3 max-w-xl text-3xl font-bold tracking-tight md:text-4xl">
                    {section.productName}
                  </h3>
                </div>

                <div className="grid bg-gray-200 sm:grid-cols-2">
                  {[
                    ["Origin", section.origin],
                    ["Form", section.form],
                    ["Packaging", section.packaging],
                    ["MOQ", section.moq],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="bg-white p-7 md:p-8"
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
                <div className="border-t border-gray-800 bg-gray-950 p-8 text-white md:p-10">
                  <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-green-200">
                    Applications
                  </h4>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {section.applications.map((application, applicationIndex) => (
                      <span
                        key={`${application}-${applicationIndex}`}
                        className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10"
                      >
                        {application}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case "applications":
      return (
        <section
          key={`applications-${index}`}
          className="bg-gray-50 px-6 py-20 md:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Applications"
              heading={section.heading}
              description={section.description}
            />

            {section.items.length > 0 && (
              <div className="mt-12 grid gap-5 md:grid-cols-2">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={`${item.title}-${itemIndex}`}
                    className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gray-100 md:p-8"
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
          </div>
        </section>
      );

    case "whyRootym":
      return (
        <section
          key={`why-rootym-${index}`}
          className="bg-white px-6 py-20 md:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader eyebrow="The ROOTYM Difference" heading={section.heading} />

            {section.points.length > 0 && (
              <div className="mt-12 grid gap-5 md:grid-cols-2">
                {section.points.map((point, pointIndex) => (
                  <div
                    key={`${point.title}-${pointIndex}`}
                    className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm md:p-8"
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
          </div>
        </section>
      );

    case "buyerFocus":
      return (
        <section
          key={`buyer-focus-${index}`}
          className="bg-gray-50 px-6 py-20 md:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Buyer Focus"
              heading={section.heading}
              description={section.description}
            />

            {section.buyerTypes.length > 0 && (
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.buyerTypes.map((buyerType, buyerIndex) => (
                  <div
                    key={`${buyerType}-${buyerIndex}`}
                    className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
                  >
                    <p className="font-bold text-gray-950">{buyerType}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case "packaging":
      return (
        <section
          key={`packaging-${index}`}
          className="bg-white px-6 py-20 md:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Packaging"
              heading={section.heading}
              description={section.description}
            />

            {section.options.length > 0 && (
              <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </section>
      );

    case "exportDocuments":
      return (
        <section
          key={`export-documents-${index}`}
          className="bg-gray-50 px-6 py-20 md:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeader
              eyebrow="Export Support"
              heading={section.heading}
              description={section.description}
            />

            {section.documents.length > 0 && (
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.documents.map((document, documentIndex) => (
                  <div
                    key={`${document}-${documentIndex}`}
                    className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                      ✓
                    </div>
                    <p className="font-semibold text-gray-900">{document}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      );

    case "cta":
      return (
        <section
          key={`cta-${index}`}
          className="relative overflow-hidden bg-green-800 px-6 py-20 text-white md:py-24"
        >
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />
          <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-green-950/30 blur-3xl" />

          <div className="relative mx-auto max-w-5xl text-center">
            <SectionHeader
              heading={section.heading}
              description={section.description}
              light
            />

            {(section.primaryCtaText || section.secondaryCtaText) && (
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                {section.primaryCtaText && (
                  <button
                    type="button"
                    className="rounded-xl bg-white px-6 py-3.5 font-semibold text-green-800 shadow-lg transition hover:bg-green-50"
                  >
                    {section.primaryCtaText}
                  </button>
                )}

                {section.secondaryCtaText && (
                  <button
                    type="button"
                    className="rounded-xl border border-green-200/70 bg-transparent px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
                  >
                    {section.secondaryCtaText}
                  </button>
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
          className="bg-white px-6 py-20 md:py-24"
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
            renderSection(section, index)
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
