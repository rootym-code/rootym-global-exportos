import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import ExportInquiryForm from "@/components/forms/ExportInquiryForm";

export const metadata: Metadata = {
  title: "Request a Quote | ROOTYM",
  description:
    "Request a customized export quotation from ROOTYM for premium Indian agricultural products including Makhana, dehydrated onion products, rice, wheat, potato products, and other export-ready commodities. Our export specialists will respond with pricing, packaging options, documentation support, and shipment details.",
  keywords: [
    "Request export quote",
    "ROOTYM quote",
    "Agricultural export enquiry",
    "Indian exporter",
    "Makhana exporter",
    "Fox nuts exporter",
    "Dehydrated onion exporter",
    "Rice exporter India",
    "Potato products exporter",
    "Bulk agricultural supplier",
    "Export quotation",
    "International food supplier",
    "Private label exporter",
    "Import enquiry",
  ],
};

const benefits = [
  {
    title: "Customized Pricing",
    description:
      "Receive a quotation tailored to your product specifications, order quantity, packaging requirements, and destination country.",
  },
  {
    title: "Export Documentation Support",
    description:
      "Our team assists with export documentation and compliance requirements to help simplify international trade.",
  },
  {
    title: "Flexible Packaging Options",
    description:
      "Choose from retail packs, bulk packaging, private labeling, or customized solutions based on your business needs.",
  },
  {
    title: "Dedicated Export Team",
    description:
      "Work directly with experienced professionals committed to providing timely communication and reliable export support.",
  },
];

export default function RequestQuotePage() {
  return (
    <>
      <Navbar />

      <main className="bg-gray-50">
        {/* Hero */}

        <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-950">
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl" />

            <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-green-600/10 blur-3xl" />

            <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>

          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

          <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-36 text-center lg:px-8">
            <span className="inline-flex rounded-full border border-green-400/30 bg-white/10 px-5 py-2 text-sm font-semibold text-green-100 backdrop-blur-md">
              Global Export Inquiry
            </span>

            <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
              Request a
              <span className="block bg-gradient-to-r from-green-300 via-emerald-200 to-lime-300 bg-clip-text text-transparent">
                Customized Export Quote
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-4xl text-lg leading-8 text-green-100/90 md:text-xl">
              Tell us your sourcing requirements and our export specialists will
              prepare a personalized quotation including pricing, packaging,
              documentation, logistics, and shipment options for your target
              market.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-green-100">
              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                APEDA Registered
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                IEC Certified
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                FSSAI Licensed
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                Global Export Ready
              </span>
            </div>
          </div>
        </section>

        {/* Benefits */}

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
                Why Request a Quote?
              </span>

              <h2 className="mt-6 text-4xl font-bold text-gray-900 md:text-5xl">
                Designed for International Buyers
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                Every enquiry is reviewed by our export team to understand your
                sourcing requirements and provide the most suitable commercial
                proposal for your business.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-xl"
                >
                  <h3 className="text-2xl font-bold text-gray-900">
                    {benefit.title}
                  </h3>

                  <p className="mt-4 leading-7 text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote Form */}

        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-12 text-center">
              <span className="rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
                Export Enquiry Form
              </span>

              <h2 className="mt-6 text-4xl font-bold text-gray-900">
                Tell Us About Your Requirements
              </h2>

              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
                Provide as much information as possible so we can prepare an
                accurate quotation tailored to your sourcing needs.
              </p>
            </div>

            <div className="mx-auto max-w-5xl">
              <ExportInquiryForm />
            </div>
          </div>
        </section>

        {/* Trust Banner */}

        <section className="pb-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-3xl bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 p-10 text-center text-white shadow-2xl">
              <h2 className="text-3xl font-bold">
                Your Trusted Partner for Agricultural Exports
              </h2>

              <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-green-100">
                From premium Indian agricultural products and customized
                packaging to export documentation and global logistics, ROOTYM
                is committed to delivering dependable sourcing solutions that
                help businesses grow with confidence.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-green-100">
                <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                  Quality Assured
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                  Export Documentation
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                  Reliable Logistics
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                  Long-Term Partnership
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

// END OF FILE