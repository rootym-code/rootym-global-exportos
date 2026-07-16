import {
    Leaf,
    PackageCheck,
    Ship,
    FileCheck,
    ShieldCheck,
    Handshake,
  } from "lucide-react";
  
  const features = [
    {
      icon: Leaf,
      title: "Direct Farm Sourcing",
      description:
        "We work closely with trusted growers across India to deliver fresh, high-quality agricultural products.",
    },
    {
      icon: PackageCheck,
      title: "Export Packaging",
      description:
        "Customized retail and bulk packaging designed to meet international buyer requirements.",
    },
    {
      icon: Ship,
      title: "Global Logistics",
      description:
        "Reliable sea and air freight support with shipment coordination from India to worldwide destinations.",
    },
    {
      icon: FileCheck,
      title: "Export Documentation",
      description:
        "Comprehensive export documentation support including commercial invoices, packing lists and shipment paperwork.",
    },
    {
      icon: ShieldCheck,
      title: "Quality Assurance",
      description:
        "Each shipment is carefully inspected to ensure export-quality standards before dispatch.",
    },
    {
      icon: Handshake,
      title: "Dedicated Buyer Support",
      description:
        "Our team supports importers from the first inquiry through shipment and after-sales assistance.",
    },
  ];
  
  export default function WhyChooseRootym() {
    return (
      <section className="bg-gradient-to-b from-white to-green-50 py-28">
        <div className="mx-auto max-w-7xl px-6">
          {/* Heading */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-[#2E7D32]">
              Why Choose ROOTYM
            </span>
  
            <h2 className="mt-6 text-5xl font-bold text-gray-900">
              Trusted Export Partner for Global Importers
            </h2>
  
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We combine trusted sourcing, export expertise, quality assurance,
              and buyer-focused support to make importing agricultural products
              from India simple, transparent, and reliable.
            </p>
          </div>
  
          {/* Feature Cards */}
          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
  
              return (
                <div
                  key={feature.title}
                  className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#2E7D32] hover:shadow-xl"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 transition group-hover:bg-[#2E7D32]">
                    <Icon className="h-8 w-8 text-[#2E7D32] transition group-hover:text-white" />
                  </div>
  
                  <h3 className="mt-8 text-2xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
  
                  <p className="mt-4 leading-7 text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }