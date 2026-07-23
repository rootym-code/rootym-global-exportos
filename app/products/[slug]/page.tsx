import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  MapPin,
  Package,
  Ship,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { getProductBySlug } from "@/lib/services/product.service";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getProductImageUrl(fileUrl?: string | null) {
  if (!fileUrl) {
    return "/images/products/placeholder.png";
  }

  if (fileUrl.startsWith("http")) {
    return fileUrl;
  }

  return `${process.env.NEXT_PUBLIC_SITE_URL}${fileUrl}`;
}

export default async function ProductPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const imageUrl = getProductImageUrl(
    product.featuredImage?.fileUrl
  );

  const description =
    product.description ??
    "Premium export-quality agricultural product sourced directly from trusted farms across India and prepared for international markets with strict quality control.";

  const packaging =
    product.defaultUnit
      ? `Available in ${product.defaultUnit} units`
      : "Export packaging available";

  const availability = "Available for Export";

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-6 py-14">

        <Link
          href="/products"
          className="mb-10 inline-flex items-center gap-2 text-[#2E7D32] hover:underline"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Products
        </Link>

        <div className="grid gap-14 lg:grid-cols-2">

          {/* LEFT */}

          <div className="rounded-3xl bg-white p-8 shadow-xl">

            <div className="relative aspect-square">

            <Image
  src={imageUrl}
  alt={product.name}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-contain"
  priority
/>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-[#2E7D32]">
              {product.category ?? "Agricultural Product"}
            </span>

            <h1 className="mt-6 text-5xl font-bold text-gray-900">
              {product.name}
            </h1>

            <p className="mt-4 text-lg leading-8 text-gray-600">
              {description}
            </p>

            <div className="mt-10 space-y-5">

              <InfoRow
                icon={<MapPin className="h-5 w-5" />}
                title="Origin"
                value={product.origin ?? "India"}
              />

              <InfoRow
                icon={<Package className="h-5 w-5" />}
                title="Packaging"
                value={packaging}
              />

              <InfoRow
                icon={<Ship className="h-5 w-5" />}
                title="Availability"
                value={availability}
              />
                          </div>

<div className="mt-10 flex flex-wrap gap-3">

  <Badge text="APEDA Registered" />

  <Badge text="Export Ready" />

  <Badge text="Premium Quality" />

  <Badge text="Global Logistics" />

  {product.hsCode && (
    <Badge text={`HS Code: ${product.hsCode}`} />
  )}

</div>

<div className="mt-12 flex flex-col gap-4 sm:flex-row">

  <Link href="/request-quote">
    <Button>
      Request Quotation
    </Button>
  </Link>

  <Button variant="secondary">
    Download Specification
  </Button>

</div>

<div className="mt-12 rounded-2xl bg-white p-6 shadow">

  <div className="flex items-center gap-3">

    <BadgeCheck className="h-6 w-6 text-[#2E7D32]" />

    <h3 className="text-lg font-semibold">
      Why Buy From ROOTYM?
    </h3>

  </div>

  <ul className="mt-5 space-y-3 text-gray-600">

    <li>✓ Direct sourcing from trusted farmers</li>

    <li>✓ Export documentation assistance</li>

    <li>✓ Quality inspection before shipment</li>

    <li>✓ Worldwide logistics support</li>

    <li>✓ Dedicated importer assistance</li>

  </ul>

</div>

</div>

</div>

</section>
</main>
);
}

function InfoRow({
icon,
title,
value,
}: {
icon: React.ReactNode;
title: string;
value: string;
}) {
return (
<div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">

<div className="text-[#2E7D32]">
{icon}
</div>

<div>

<p className="text-sm text-gray-500">
{title}
</p>

<p className="font-semibold text-gray-900">
{value}
</p>

</div>

</div>
);
}

function Badge({ text }: { text: string }) {
return (
<span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-[#2E7D32]">
{text}
</span>
);
}

 