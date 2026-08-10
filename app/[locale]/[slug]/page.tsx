import { notFound } from "next/navigation";

import cmsPageService from "@/lib/services/cms/page.service";
import { CmsPageStatus } from "@/lib/generated/prisma";

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
          <div className="mt-10 whitespace-pre-wrap text-base leading-8 text-gray-700">
            {translation.content}
          </div>
        )}
      </section>
    </main>
  );
}