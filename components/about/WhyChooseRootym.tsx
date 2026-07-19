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
    title: "Trusted Partnerships",
    description:
      "We build long-term relationships with buyers, farmers, and manufacturers through transparency, reliability, and ethical business practices.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "Every product undergoes strict quality checks to ensure it meets international export standards and buyer expectations.",
  },
  {
    icon: Globe2,
    title: "Global Export Focus",
    description:
      "Our operations are designed to serve international markets with dependable sourcing, documentation, and logistics coordination.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance & Documentation",
    description:
      "We support buyers with export documentation, certifications, and compliance processes for seamless international trade.",
  },
  {
    icon: Truck,
    title: "Reliable Supply Chain",
    description:
      "Efficient sourcing and logistics ensure timely deliveries while maintaining product integrity throughout the supply chain.",
  },
  {
    icon: Leaf,
    title: "Sustainable Sourcing",
    description:
      "We promote responsible sourcing practices that benefit farming communities while supporting environmentally conscious agriculture.",
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
              Why ROOTYM
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Why Businesses Around the World
              <span className="block text-green-700">
                Choose ROOTYM
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              We combine India's agricultural excellence with global trade
              expertise, delivering dependable products and professional
              export services that help businesses grow with confidence.
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

                  <h3 className="mt-8 text-2xl font-bold text-slate-900">
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
                  Trusted Export Partner
                </span>

                <h3 className="mt-6 text-4xl font-bold leading-tight">
                  Building Long-Term Global Business Relationships
                </h3>

                <p className="mt-6 text-lg leading-8 text-green-50">
                  At ROOTYM, we believe successful exports are built on trust,
                  consistency, and transparency. From sourcing premium
                  agricultural products to coordinating international shipments,
                  our team is committed to delivering value at every stage of
                  the export journey.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Quality
                  </h4>

                  <p className="mt-3 text-green-100">
                    Carefully sourced products meeting international standards.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Transparency
                  </h4>

                  <p className="mt-3 text-green-100">
                    Honest communication throughout every business transaction.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Reliability
                  </h4>

                  <p className="mt-3 text-green-100">
                    Dependable deliveries backed by efficient supply chain
                    management.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Growth
                  </h4>

                  <p className="mt-3 text-green-100">
                    Creating lasting value for buyers, suppliers, and farming
                    communities.
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