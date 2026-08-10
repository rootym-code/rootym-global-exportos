import { notFound } from "next/navigation";

import cmsPageService from "@/lib/services/cms/page.service";
import {
  CmsPageStatus,
  CmsPageTemplate,
} from "@/lib/generated/prisma";

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

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
      item.language.code.toLowerCase() ===
      locale.toLowerCase()
  );

  if (!translation || !translation.isPublished) {
    notFound();
  }

  const isCountryLanding =
    page.template === CmsPageTemplate.COUNTRY_LANDING;

  if (isCountryLanding) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="mb-4 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              ROOTYM Global Market
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              {translation.title}
            </h1>

            {translation.excerpt && (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600">
                {translation.excerpt}
              </p>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Market
              </p>
              <p className="mt-2 text-xl font-semibold text-gray-900">
                {translation.title}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Language
              </p>
              <p className="mt-2 text-xl font-semibold text-gray-900">
                {translation.language.name}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                Export Availability
              </p>
              <p className="mt-2 text-xl font-semibold text-green-700">
                Available
              </p>
            </div>
          </div>

          {translation.content && (
            <article className="mt-10 rounded-3xl bg-white p-8 shadow-sm md:p-12">
              <div className="whitespace-pre-wrap text-base leading-8 text-gray-700">
                {translation.content}
              </div>
            </article>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-900">
          {translation.title}
        </h1>

        {translation.excerpt && (
          <p className="mt-4 text-lg text-gray-600">
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
}