import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
  ArrowRight,
  BadgeCheck,
  Globe2,
  Package,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ProductStatus } from "@/lib/generated/prisma";
import { listProducts } from "@/lib/services/product.service";

export const metadata = {
  title: "Products | ROOTYM Global Export Platform",
  description:
    "Discover premium Indian agricultural products sourced responsibly and prepared for international markets with ROOTYM.",
};

export default async function ProductsPage() {
  const { items: products } = await listProducts({
    status: ProductStatus.PUBLISHED,
    page: 1,
    pageSize: 100,
  });
    return (
        <>
          <Navbar />
      
          <main className="overflow-x-hidden bg-white">
      {/* -------------------------------------------------------------------------- */}
      {/* Hero */}
      {/* -------------------------------------------------------------------------- */}

      <section className="relative overflow-hidden border-b border-green-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#DCFCE7,transparent_40%),radial-gradient(circle_at_bottom_left,#ECFDF5,transparent_40%)]" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-5 py-2 text-sm font-semibold text-[#2E7D32] shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Export Ready Agricultural Products
          </div>

          <h1 className="mt-8 max-w-5xl text-5xl font-extrabold leading-tight tracking-tight text-gray-900 lg:text-7xl">
            Premium Indian Agricultural Products
            <span className="block bg-gradient-to-r from-[#2E7D32] to-[#43A047] bg-clip-text text-transparent">
              Built for Global Trade
            </span>
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-9 text-gray-600">
            ROOTYM connects international buyers with carefully sourced
            Indian agricultural products backed by quality assurance,
            export compliance, transparent sourcing and dependable
            logistics.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/request-quote">
              <Button className="px-8 py-3">
                Request Export Quote
              </Button>
            </Link>

            <Link href="#portfolio">
              <Button variant="secondary" className="px-8 py-3">
                Explore Products
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid w-full max-w-5xl gap-5 md:grid-cols-4">
            <TrustCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Quality Assured"
              subtitle="Inspection & Compliance"
            />

            <TrustCard
              icon={<BadgeCheck className="h-6 w-6" />}
              title="Export Ready"
              subtitle="Documentation Support"
            />

            <TrustCard
              icon={<Truck className="h-6 w-6" />}
              title="Reliable Logistics"
              subtitle="Global Shipping"
            />

            <TrustCard
              icon={<Globe2 className="h-6 w-6" />}
              title="International Trade"
              subtitle="Trusted Export Partner"
            />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* Product Portfolio */}
      {/* -------------------------------------------------------------------------- */}

      <section
        id="portfolio"
        className="mx-auto max-w-7xl px-6 py-24"
      >
        <div className="max-w-3xl">
          <span className="font-semibold uppercase tracking-[0.25em] text-[#2E7D32]">
            Product Portfolio
          </span>

          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            Agricultural Products Prepared for International Buyers
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Every product is sourced through trusted supplier networks,
            prepared with export-quality standards and supported by
            documentation that simplifies international trade.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group"
            >
              <article className="overflow-hidden rounded-3xl border border-green-100 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                <div className="relative aspect-[4/3] bg-[#F8FBF8]">
                  <Image
                    src={product.featuredImage?.fileUrl ?? "/images/products/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-7">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-[#2E7D32]">
                    {product.category}
                  </span>

                  <h3 className="mt-5 text-2xl font-bold text-gray-900">
                    {product.name}
                  </h3>

                  <div className="mt-6 flex items-center gap-3 text-gray-600">
                    <Package className="h-5 w-5 text-[#2E7D32]" />
                    <span>{product.origin}</span>
                  </div>

                  <div className="mt-8 inline-flex items-center gap-2 font-semibold text-[#2E7D32]">
                    View Export Details
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
            {/* -------------------------------------------------------------------------- */}
      {/* Why Source from ROOTYM */}
      {/* -------------------------------------------------------------------------- */}

      <section className="bg-[#F8FBF8] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-semibold uppercase tracking-[0.25em] text-[#2E7D32]">
              Buyer Confidence
            </span>

            <h2 className="mt-4 text-4xl font-bold text-gray-900">
              Why International Buyers Choose ROOTYM
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              We don't simply export products—we build long-term
              international business relationships through transparency,
              quality assurance, reliable communication and dependable
              logistics.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            <FeatureCard
              icon={<BadgeCheck className="h-7 w-7" />}
              title="Verified Sourcing"
              description="Products are sourced through trusted farmer and supplier networks with complete traceability."
            />

            <FeatureCard
              icon={<ShieldCheck className="h-7 w-7" />}
              title="Quality Assurance"
              description="Every shipment follows export quality standards with inspection and documentation support."
            />

            <FeatureCard
              icon={<Package className="h-7 w-7" />}
              title="Flexible Packaging"
              description="Retail, wholesale and bulk export packaging tailored to international buyer requirements."
            />

            <FeatureCard
              icon={<Truck className="h-7 w-7" />}
              title="Export Logistics"
              description="Support for container planning, shipping coordination and international documentation."
            />

            <FeatureCard
              icon={<Globe2 className="h-7 w-7" />}
              title="Global Trade Focus"
              description="Serving importers, distributors, retailers and food businesses across international markets."
            />

            <FeatureCard
              icon={<Sparkles className="h-7 w-7" />}
              title="AI-Powered Future"
              description="ROOTYM Brain will assist buyers with intelligent product recommendations and sourcing decisions."
            />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* Export Journey */}
      {/* -------------------------------------------------------------------------- */}

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <span className="font-semibold uppercase tracking-[0.25em] text-[#2E7D32]">
            Export Journey
          </span>

          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            From Indian Farms to Global Markets
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            ROOTYM manages every stage of the export journey with a focus
            on transparency, compliance and dependable execution.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3 xl:grid-cols-6">
          <JourneyStep
            number="01"
            title="Sourcing"
            description="Trusted farmer and supplier network"
          />

          <JourneyStep
            number="02"
            title="Inspection"
            description="Quality verification and grading"
          />

          <JourneyStep
            number="03"
            title="Packaging"
            description="Export-ready packaging solutions"
          />

          <JourneyStep
            number="04"
            title="Documentation"
            description="Export compliance and paperwork"
          />

          <JourneyStep
            number="05"
            title="Shipment"
            description="Reliable international logistics"
          />

          <JourneyStep
            number="06"
            title="Delivery"
            description="Successful arrival to global buyers"
          />
        </div>
      </section>
            {/* -------------------------------------------------------------------------- */}
      {/* AI Powered Future */}
      {/* -------------------------------------------------------------------------- */}

      <section className="bg-gradient-to-br from-green-950 via-green-900 to-emerald-950 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-5xl text-center text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-300/30 bg-white/10 px-5 py-2 text-sm font-semibold text-green-100 backdrop-blur">
              <Sparkles className="h-4 w-4 text-green-300" />
              ROOTYM Brain
            </div>

            <h2 className="mt-8 text-4xl font-bold md:text-6xl">
              Intelligent Export Decisions
              <span className="block bg-gradient-to-r from-green-300 via-emerald-200 to-lime-300 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-green-100">
              In the future, ROOTYM Brain will help international buyers
              identify suitable products based on their country, market
              requirements, quantity, packaging preferences and business
              objectives.
            </p>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <AIBox
                title="Market Understanding"
                description="Identify suitable Indian agricultural products for your target market."
              />

              <AIBox
                title="Product Recommendation"
                description="Receive intelligent recommendations based on buyer requirements."
              />

              <AIBox
                title="Export Assistance"
                description="Get guidance on packaging, documentation and shipment planning."
              />
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* Final CTA */}
      {/* -------------------------------------------------------------------------- */}

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-3xl bg-gradient-to-r from-[#2E7D32] to-[#43A047] px-8 py-14 text-center shadow-2xl md:px-16">
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Ready to Source Premium Indian Products?
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-green-50">
            Connect with ROOTYM for export enquiries, product
            specifications, bulk requirements and long-term sourcing
            partnerships.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/request-quote">
              <Button className="bg-white px-8 py-3 text-[#2E7D32] hover:bg-green-50">
                Request Export Quote
              </Button>
            </Link>

            <Link href="/contact">
              <Button
                variant="secondary"
                className="border-white bg-transparent px-8 py-3 text-white hover:bg-white/10"
              >
                Contact ROOTYM Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
      </main>

<Footer />
</>
);
}

/* -------------------------------------------------------------------------- */
/* Helper Components */
/* -------------------------------------------------------------------------- */

function TrustCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
      <div className="flex justify-center text-[#2E7D32]">
        {icon}
      </div>

      <h3 className="mt-4 text-center font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-1 text-center text-sm text-gray-600">
        {subtitle}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="inline-flex rounded-2xl bg-green-100 p-4 text-[#2E7D32]">
        {icon}
      </div>

      <h3 className="mt-6 text-2xl font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-gray-600">
        {description}
      </p>
    </div>
  );
}

function JourneyStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-green-100 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 font-bold text-[#2E7D32]">
        {number}
      </div>

      <h3 className="mt-5 font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
}

function AIBox({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
      <h3 className="text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-green-100">
        {description}
      </p>
    </div>
  );
}


// END OF FILE
