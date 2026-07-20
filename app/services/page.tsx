import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  FileCheck2,
  Globe2,
  Package,
  ShieldCheck,
  Ship,
  Sparkles,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Export Services | ROOTYM Global Export Platform",
  description:
    "End-to-end agricultural export services from India including sourcing, quality assurance, export documentation, packaging and international logistics.",
};

export default function ServicesPage() {
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
            Complete Export Solutions
          </div>

          <h1 className="mt-8 max-w-5xl text-5xl font-extrabold leading-tight tracking-tight text-gray-900 lg:text-7xl">
            End-to-End
            <span className="block bg-gradient-to-r from-[#2E7D32] to-[#43A047] bg-clip-text text-transparent">
              Agricultural Export Services
            </span>
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-9 text-gray-600">
            ROOTYM supports international buyers throughout the export
            lifecycle—from sourcing quality agricultural products in India
            to documentation, packaging, logistics and successful global
            delivery.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/request-quote">
              <Button className="px-8 py-3">
                Request Export Quote
              </Button>
            </Link>

            <Link href="#services">
              <Button variant="secondary" className="px-8 py-3">
                Explore Services
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid w-full max-w-5xl gap-5 md:grid-cols-4">
            <HighlightCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Quality First"
              subtitle="Inspection & Assurance"
            />

            <HighlightCard
              icon={<FileCheck2 className="h-6 w-6" />}
              title="Compliance"
              subtitle="Export Documentation"
            />

            <HighlightCard
              icon={<Truck className="h-6 w-6" />}
              title="Global Logistics"
              subtitle="Reliable Coordination"
            />

            <HighlightCard
              icon={<Globe2 className="h-6 w-6" />}
              title="Worldwide Trade"
              subtitle="Buyer Focused"
            />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* Core Services */}
      {/* -------------------------------------------------------------------------- */}

      <section
        id="services"
        className="mx-auto max-w-7xl px-6 py-24"
      >
        <div className="max-w-3xl">
          <span className="font-semibold uppercase tracking-[0.25em] text-[#2E7D32]">
            Core Services
          </span>

          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            Everything Required for Successful Agricultural Exports
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our services are designed to simplify international sourcing
            while maintaining transparency, compliance and product
            quality at every stage.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          <ServiceCard
            icon={<Package className="h-7 w-7" />}
            title="Product Sourcing"
            description="Reliable sourcing from trusted farmer and supplier networks across India."
          />

          <ServiceCard
            icon={<ClipboardCheck className="h-7 w-7" />}
            title="Quality Inspection"
            description="Inspection, grading and quality verification before shipment."
          />

          <ServiceCard
            icon={<BadgeCheck className="h-7 w-7" />}
            title="Export Documentation"
            description="Support for commercial documentation and export compliance."
          />

          <ServiceCard
            icon={<Package className="h-7 w-7" />}
            title="Packaging Solutions"
            description="Retail, wholesale and bulk packaging tailored for export markets."
          />

          <ServiceCard
            icon={<Ship className="h-7 w-7" />}
            title="Freight Coordination"
            description="Coordination with logistics partners for efficient international shipping."
          />

          <ServiceCard
            icon={<Globe2 className="h-7 w-7" />}
            title="Buyer Support"
            description="Dedicated communication from enquiry through successful delivery."
          />
        </div>
      </section>
            {/* -------------------------------------------------------------------------- */}
      {/* Export Workflow */}
      {/* -------------------------------------------------------------------------- */}

      <section className="bg-[#F8FBF8] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-semibold uppercase tracking-[0.25em] text-[#2E7D32]">
              Export Workflow
            </span>

            <h2 className="mt-4 text-4xl font-bold text-gray-900">
              A Structured Export Process You Can Trust
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Every shipment follows a transparent workflow to ensure
              product quality, documentation accuracy and timely
              international delivery.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3 xl:grid-cols-6">
            <WorkflowStep
              number="01"
              title="Requirement"
              description="Understand buyer requirements, quantity and destination."
            />

            <WorkflowStep
              number="02"
              title="Sourcing"
              description="Select products through trusted supplier networks."
            />

            <WorkflowStep
              number="03"
              title="Inspection"
              description="Verify quality, grading and export readiness."
            />

            <WorkflowStep
              number="04"
              title="Documentation"
              description="Prepare export documentation and compliance records."
            />

            <WorkflowStep
              number="05"
              title="Shipment"
              description="Coordinate packaging, logistics and freight movement."
            />

            <WorkflowStep
              number="06"
              title="Delivery"
              description="Support buyers until successful international delivery."
            />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* Why ROOTYM */}
      {/* -------------------------------------------------------------------------- */}

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <span className="font-semibold uppercase tracking-[0.25em] text-[#2E7D32]">
            Why ROOTYM
          </span>

          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            A Reliable Export Partner for Long-Term Business
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Our objective is not simply to complete one shipment. We aim
            to become a trusted sourcing and export partner that buyers
            can depend on year after year.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <WhyCard
            title="Transparent Communication"
            description="Clear pricing, shipment updates and responsive communication throughout every stage."
          />

          <WhyCard
            title="Export Compliance"
            description="Documentation support aligned with international trade requirements."
          />

          <WhyCard
            title="Quality Commitment"
            description="Consistent focus on sourcing reliable products and maintaining export standards."
          />

          <WhyCard
            title="Reliable Execution"
            description="Planning, coordination and logistics managed with professionalism."
          />

          <WhyCard
            title="Buyer-Centric Approach"
            description="Solutions customized to importer requirements instead of one-size-fits-all offerings."
          />

          <WhyCard
            title="Long-Term Partnerships"
            description="Building sustainable business relationships through trust and consistent performance."
          />
        </div>
      </section>
            {/* -------------------------------------------------------------------------- */}
      {/* ROOTYM Brain */}
      {/* -------------------------------------------------------------------------- */}

      <section className="bg-gradient-to-br from-green-950 via-green-900 to-emerald-950 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-5xl text-center text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-green-300/30 bg-white/10 px-5 py-2 text-sm font-semibold text-green-100 backdrop-blur">
              <Sparkles className="h-4 w-4 text-green-300" />
              Future Ready
            </div>

            <h2 className="mt-8 text-4xl font-bold md:text-6xl">
              ROOTYM Brain
              <span className="block bg-gradient-to-r from-green-300 via-emerald-200 to-lime-300 bg-clip-text text-transparent">
                AI-Powered Export Assistance
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-green-100">
              We are building intelligent capabilities that will simplify
              international sourcing, product discovery and export
              planning for buyers around the world.
            </p>

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <AIServiceCard
                title="Product Matching"
                description="Recommend suitable products based on buyer requirements."
              />

              <AIServiceCard
                title="Market Insights"
                description="Help identify products suited for target countries and industries."
              />

              <AIServiceCard
                title="Export Planning"
                description="Assist buyers with packaging, documentation and shipment planning."
              />

              <AIServiceCard
                title="Smart Support"
                description="Provide intelligent guidance throughout the sourcing journey."
              />
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------------- */}
      {/* Call To Action */}
      {/* -------------------------------------------------------------------------- */}

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-3xl bg-gradient-to-r from-[#2E7D32] to-[#43A047] px-8 py-14 text-center shadow-2xl md:px-16">
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Let's Build Your Next Export Partnership
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-green-50">
            Whether you require bulk agricultural products, customized
            packaging or complete export support, ROOTYM is ready to help
            you source confidently from India.
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
                Contact ROOTYM
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

/* -------------------------------------------------------------------------- */
/* Helper Components */
/* -------------------------------------------------------------------------- */

function HighlightCard({
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

      <p className="mt-2 text-center text-sm text-gray-600">
        {subtitle}
      </p>
    </div>
  );
}

function ServiceCard({
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

function WorkflowStep({
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

function WhyCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-gray-600">
        {description}
      </p>
    </div>
  );
}

function AIServiceCard({
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
