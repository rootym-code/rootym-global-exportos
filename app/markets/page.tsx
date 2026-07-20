import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Globe2,
  MapPin,
  PackageCheck,
  Ship,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Global Markets | ROOTYM Agro Harvest Private Limited",
  description:
    "ROOTYM connects global buyers with premium Indian agricultural products through reliable sourcing, export compliance, quality assurance and international logistics support.",
  keywords: [
    "ROOTYM Global Markets",
    "Indian Agricultural Exporter",
    "Agricultural Export Company India",
    "Food Export Partner",
    "Indian Food Export",
    "Global Agricultural Supply Chain",
  ],
};

export default function MarketsPage() {
  return (
    <>
      <Navbar />

      <main className="overflow-x-hidden bg-white">
        {/* -------------------------------------------------------------------------- */}
        {/* Hero Section */}
        {/* -------------------------------------------------------------------------- */}

        <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F5FBF5] to-white py-28">
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-green-200/40 blur-3xl" />

            <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-5 py-2 text-sm font-semibold text-[#2E7D32] shadow-sm">
              <Globe2 className="h-4 w-4" />
              Global Export Network
            </div>

            <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-bold tracking-tight text-gray-900 md:text-7xl">
              Connecting Indian Agriculture
              <span className="block bg-gradient-to-r from-[#2E7D32] via-green-600 to-emerald-500 bg-clip-text text-transparent">
                With Global Markets
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">
              ROOTYM helps international buyers source premium Indian
              agricultural products through transparent sourcing, export
              compliance, quality assurance and reliable global logistics.
            </p>

            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/request-quote">
                <Button className="px-8 py-3">
                  Request Export Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href="/contact">
                <Button
                  variant="secondary"
                  className="px-8 py-3"
                >
                  Contact Export Team
                </Button>
              </Link>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-4">
              <MarketHighlight
                icon={<ShieldCheck />}
                title="Export Compliance"
                description="Documentation and regulatory support."
              />

              <MarketHighlight
                icon={<PackageCheck />}
                title="Quality Assurance"
                description="Reliable sourcing and inspection."
              />

              <MarketHighlight
                icon={<Ship />}
                title="Global Logistics"
                description="Shipment coordination worldwide."
              />

              <MarketHighlight
                icon={<TrendingUp />}
                title="Long-Term Supply"
                description="Partnership-focused approach."
              />
            </div>
          </div>
        </section>
                {/* -------------------------------------------------------------------------- */}
        {/* Global Markets Section */}
        {/* -------------------------------------------------------------------------- */}

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">

            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-[#2E7D32]">
                <MapPin className="h-4 w-4" />
                Markets We Serve
              </span>

              <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                Indian Agricultural Products
                <span className="block text-[#2E7D32]">
                  For Global Buyers
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                ROOTYM is building trusted trade relationships with importers,
                distributors, retailers and food businesses across multiple
                international markets.
              </p>
            </div>


            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              <RegionCard
                title="Middle East"
                countries="UAE • Saudi Arabia • Qatar • Oman • Kuwait"
                description="Serving growing demand for premium Indian food products among importers, distributors and retail networks."
              />


              <RegionCard
                title="Europe"
                countries="EU Countries • Specialty Food Markets"
                description="Supporting buyers looking for reliable agricultural sourcing with quality documentation and compliance."
              />


              <RegionCard
                title="United Kingdom"
                countries="UK Importers • Ethnic Food Retailers"
                description="Connecting Indian agricultural products with established food distribution channels."
              />


              <RegionCard
                title="North America"
                countries="USA • Canada"
                description="Helping international buyers access authentic Indian agricultural products with dependable supply."
              />


              <RegionCard
                title="Southeast Asia"
                countries="Singapore • Malaysia • Sri Lanka"
                description="Building regional partnerships through flexible sourcing and export support."
              />


              <RegionCard
                title="Africa"
                countries="Emerging Food Markets"
                description="Supporting growing markets with scalable agricultural product supply solutions."
              />

            </div>

          </div>
        </section>


        {/* -------------------------------------------------------------------------- */}
        {/* Why India Section */}
        {/* -------------------------------------------------------------------------- */}

        <section className="bg-[#F8FBF8] py-24">

          <div className="mx-auto max-w-7xl px-6">

            <div className="grid gap-14 lg:grid-cols-2 lg:items-center">


              <div>

                <span className="rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-[#2E7D32]">
                  India Advantage
                </span>


                <h2 className="mt-6 text-4xl font-bold text-gray-900 md:text-5xl">
                  Why Global Buyers
                  <span className="block text-[#2E7D32]">
                    Source From India
                  </span>
                </h2>


                <p className="mt-6 text-lg leading-8 text-gray-600">
                  India offers one of the world's most diverse agricultural
                  ecosystems. ROOTYM combines this strength with professional
                  export practices to deliver consistent value to global
                  customers.
                </p>


              </div>


              <div className="grid gap-5 sm:grid-cols-2">

                <AdvantageCard
                  title="Agricultural Diversity"
                  description="Wide range of premium crops and food products."
                />

                <AdvantageCard
                  title="Competitive Supply"
                  description="Efficient sourcing from trusted Indian producers."
                />

                <AdvantageCard
                  title="Export Readiness"
                  description="Documentation and compliance support."
                />

                <AdvantageCard
                  title="Quality Focus"
                  description="Inspection and quality-first approach."
                />

              </div>


            </div>

          </div>

        </section>
                {/* -------------------------------------------------------------------------- */}
        {/* Export Capability Section */}
        {/* -------------------------------------------------------------------------- */}

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">

            <div className="mx-auto max-w-3xl text-center">

              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-[#2E7D32]">
                <Sparkles className="h-4 w-4" />
                Export Capabilities
              </span>


              <h2 className="mt-6 text-4xl font-bold text-gray-900 md:text-5xl">
                Complete Support
                <span className="block text-[#2E7D32]">
                  From Farm To Final Destination
                </span>
              </h2>


              <p className="mt-6 text-lg leading-8 text-gray-600">
                ROOTYM provides end-to-end export support so buyers can source
                confidently with transparency at every stage.
              </p>

            </div>


            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

              <CapabilityCard
                title="Bulk Supply"
                description="Large quantity sourcing for importers and distributors."
              />

              <CapabilityCard
                title="Custom Packaging"
                description="Retail packs, bulk packs and private label solutions."
              />

              <CapabilityCard
                title="Quality Inspection"
                description="Quality checks before shipment."
              />

              <CapabilityCard
                title="Documentation"
                description="Export paperwork and compliance assistance."
              />

              <CapabilityCard
                title="Logistics Support"
                description="Coordination with shipping and freight partners."
              />

              <CapabilityCard
                title="Buyer Assistance"
                description="Dedicated support throughout the trade journey."
              />

              <CapabilityCard
                title="Market Understanding"
                description="Products aligned with international demand."
              />

              <CapabilityCard
                title="Long-Term Partnership"
                description="Building reliable global relationships."
              />

            </div>

          </div>
        </section>



        {/* -------------------------------------------------------------------------- */}
        {/* Export Journey Section */}
        {/* -------------------------------------------------------------------------- */}


        <section className="bg-gradient-to-br from-green-950 via-green-900 to-emerald-950 py-24">

          <div className="mx-auto max-w-7xl px-6">

            <div className="mx-auto max-w-3xl text-center text-white">

              <span className="rounded-full border border-green-300/30 bg-white/10 px-5 py-2 text-sm font-semibold text-green-100">
                Global Export Journey
              </span>


              <h2 className="mt-8 text-4xl font-bold md:text-5xl">
                A Transparent Process
                <span className="block text-green-300">
                  Built For Trust
                </span>
              </h2>


              <p className="mt-6 text-lg leading-8 text-green-100">
                Every export order follows a structured process designed to
                provide clarity, confidence and smooth international delivery.
              </p>

            </div>


            <div className="mt-16 grid gap-6 md:grid-cols-3 lg:grid-cols-5">

              <JourneyStep
                number="01"
                title="Buyer Enquiry"
                description="Understand product requirements."
              />

              <JourneyStep
                number="02"
                title="Product Selection"
                description="Recommend suitable products."
              />

              <JourneyStep
                number="03"
                title="Quality Approval"
                description="Confirm specifications."
              />

              <JourneyStep
                number="04"
                title="Shipment"
                description="Manage export process."
              />

              <JourneyStep
                number="05"
                title="Delivery"
                description="Complete global delivery."
              />

            </div>

          </div>

        </section>
                {/* -------------------------------------------------------------------------- */}
        {/* ROOTYM Brain Section */}
        {/* -------------------------------------------------------------------------- */}

        <section className="py-24">

          <div className="mx-auto max-w-7xl px-6">

            <div className="rounded-3xl bg-gradient-to-r from-[#2E7D32] to-[#43A047] px-8 py-14 text-center shadow-2xl md:px-16">

              <div className="mx-auto max-w-5xl">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white">
                  <Sparkles className="h-4 w-4" />
                  ROOTYM CO-CAPTAIN
                </div>


                <h2 className="mt-8 text-4xl font-bold text-white md:text-5xl">
                Meet ROOTYM CO-CAPTAIN
                  <span className="block text-green-100">
                  Your Intelligent Export Partner
                  </span>
                </h2>


                <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-green-50">
                ROOTYM CO-CAPTAIN is our intelligent AI platform designed to work alongside importers, distributors, wholesalers and food businesses throughout the global sourcing journey. From product discovery and market insights to export documentation and shipment planning, CO-CAPTAIN helps buyers make faster, smarter and more confident decisions.
                </p>


                <div className="mt-12 grid gap-6 md:grid-cols-3">

                  <AIBox
                    title="Global Market Advisor"
                    description="Discover market opportunities, buyer trends and sourcing insights across international regions."
                  />

                  <AIBox
                    title="Smart Product Matching"
                    description="Receive intelligent product recommendations based on destination, quality expectations and business requirements."
                  />

                  <AIBox
                    title="Export Co-Captain"
                    description="Get AI-powered guidance for documentation, packaging, logistics and export planning from enquiry to delivery."
                  />

                </div>

              </div>

            </div>

          </div>

        </section>



        {/* -------------------------------------------------------------------------- */}
        {/* Final CTA */}
        {/* -------------------------------------------------------------------------- */}

        <section className="bg-[#F8FBF8] py-24">

          <div className="mx-auto max-w-7xl px-6">

            <div className="rounded-3xl border border-green-100 bg-white p-10 text-center shadow-xl md:p-16">

              <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
                Ready To Build A Global
                <span className="block text-[#2E7D32]">
                  Sourcing Partnership?
                </span>
              </h2>


              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
                Whether you are an importer, distributor, retailer or food
                manufacturer, ROOTYM is ready to support your agricultural
                sourcing requirements from India.
              </p>


              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

                <Link href="/request-quote">
                  <Button className="px-8 py-3">
                    Start Your Enquiry
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>


                <Link href="/contact">
                  <Button
                    variant="secondary"
                    className="px-8 py-3"
                  >
                    Contact ROOTYM
                  </Button>
                </Link>

              </div>

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


function MarketHighlight({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">

      <div className="flex justify-center text-[#2E7D32]">
        {icon}
      </div>

      <h3 className="mt-4 text-center font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 text-center text-sm text-gray-600">
        {description}
      </p>

    </div>
  );
}


function RegionCard({
  title,
  countries,
  description,
}: {
  title: string;
  countries: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      <Globe2 className="h-8 w-8 text-[#2E7D32]" />

      <h3 className="mt-6 text-2xl font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 text-sm font-semibold text-[#2E7D32]">
        {countries}
      </p>

      <p className="mt-4 leading-7 text-gray-600">
        {description}
      </p>

    </div>
  );
}


function AdvantageCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">

      <h3 className="font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        {description}
      </p>

    </div>
  );
}


function CapabilityCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">

      <h3 className="text-xl font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 text-gray-600">
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
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-center backdrop-blur-md">

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/20 font-bold text-white">
        {number}
      </div>

      <h3 className="mt-5 font-bold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-green-100">
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
    <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-md">

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