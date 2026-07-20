"use client";

import { motion, type Variants } from "framer-motion";
import {
  Award,
  Globe2,
  Handshake,
  Leaf,
  ShieldCheck,
  Truck,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const features = [
  {
    icon: Handshake,
    title: "Long-Term Business Relationships",
    description:
      "We build lasting partnerships with buyers, farmers, manufacturers, and logistics partners through transparency, reliability, and consistent business practices.",
  },
  {
    icon: Award,
    title: "Consistent Export Quality",
    description:
      "Every shipment is supported by disciplined quality assurance processes to meet buyer specifications and international export expectations.",
  },
  {
    icon: Globe2,
    title: "International Trade Expertise",
    description:
      "From sourcing to shipment coordination, we help buyers navigate global trade with dependable documentation and export support.",
  },
  {
    icon: ShieldCheck,
    title: "Export Compliance & Documentation",
    description:
      "We assist with export documentation, certifications, regulatory compliance, and customs requirements for smooth international transactions.",
  },
  {
    icon: Truck,
    title: "Reliable Supply Network",
    description:
      "Our verified sourcing and logistics network helps ensure consistent product availability and timely deliveries across global markets.",
  },
  {
    icon: Leaf,
    title: "Responsible Sourcing",
    description:
      "We promote ethical sourcing practices that support farming communities while encouraging sustainable agricultural development.",
  },
];

export default function WhyChooseRootym() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            variants={fadeUpVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
              Why Global Buyers Choose ROOTYM
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              A Reliable Export Partner

              <span className="block text-green-700">
                for Global Buyers
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              ROOTYM combines trusted sourcing, rigorous quality assurance,
              export compliance, and dependable logistics to help importers,
              wholesalers, distributors, retailers, and food manufacturers
              source premium Indian agricultural products with confidence.
            </p>
          </motion.div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUpVariants}
                  className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-200 hover:shadow-xl"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 transition-colors duration-300 group-hover:bg-green-700">
                    <Icon className="h-8 w-8 text-green-700 transition-colors duration-300 group-hover:text-white" />
                  </div>

                  <h3 className="mt-8 min-h-[64px] text-2xl font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-4 leading-8 text-slate-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Trust Section */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-20 overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-r from-green-700 via-green-600 to-green-700 shadow-xl"
          >
            <div className="grid gap-12 p-10 lg:grid-cols-2 lg:items-center lg:p-14">
              <div className="text-white">
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                  Built for Long-Term Partnerships
                </span>

                <h3 className="mt-6 text-4xl font-bold leading-tight">
                  More Than an Exporter.
                  <br />
                  A Reliable Business Partner.
                </h3>

                <p className="mt-6 text-lg leading-8 text-green-50">
                  At ROOTYM, we believe successful international trade is
                  built on trust, consistency, and transparent communication.
                  From sourcing premium agricultural products to managing
                  export coordination, our focus is to deliver dependable
                  solutions that help buyers build long-term supply
                  relationships.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Export Quality
                  </h4>

                  <p className="mt-3 text-green-100">
                    Carefully sourced products supported by quality assurance
                    and international standards.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Transparency
                  </h4>

                  <p className="mt-3 text-green-100">
                    Clear communication and honest business practices at every
                    stage of the partnership.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Reliable Execution
                  </h4>

                  <p className="mt-3 text-green-100">
                    Dependable sourcing, documentation, and logistics support
                    for smooth export operations.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Long-Term Growth
                  </h4>

                  <p className="mt-3 text-green-100">
                    Creating sustainable value for buyers, suppliers, and
                    farming communities.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}