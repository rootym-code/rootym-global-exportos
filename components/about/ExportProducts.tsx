"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Globe2,
  Package,
  ShieldCheck,
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

const products = [
  {
    name: "Premium Makhana",
    image: "/images/products/makhana.webp",
    origin: "Mithilanchal, Bihar",
    packaging: "250g • 500g • 1kg • Bulk",
    markets: "UAE • Europe • USA",
    description:
      "Premium-grade fox nuts sourced from the renowned Mithilanchal region of Bihar, carefully processed to deliver exceptional taste, consistency, and export-quality standards.",
  },
  {
    name: "Dehydrated Onion Powder",
    image: "/images/products/onion-powder.webp",
    origin: "Nashik, Maharashtra",
    packaging: "25kg Export Bags",
    markets: "Middle East • Europe",
    description:
      "Export-grade dehydrated onion powder manufactured from premium Indian onions, ideal for food processing, seasoning, and industrial food applications.",
  },
  {
    name: "Frozen French Fries",
    image: "/images/products/french-fries.webp",
    origin: "India",
    packaging: "Retail & Bulk",
    markets: "GCC • Africa",
    description:
      "Premium frozen French fries processed under stringent food safety standards for distributors, restaurant chains, and food service businesses.",
  },
  {
    name: "Potato Starch",
    image: "/images/products/potato-starch.webp",
    origin: "India",
    packaging: "25kg Export Bags",
    markets: "Asia • Middle East",
    description:
      "High-quality food-grade potato starch suitable for food manufacturing, processing industries, and a wide range of commercial applications.",
  },
  {
    name: "Non-Basmati Rice",
    image: "/images/products/rice.webp",
    origin: "Bihar",
    packaging: "5kg • 25kg • 50kg",
    markets: "Africa • Middle East",
    description:
      "Premium Indian rice sourced from trusted farming communities, offering excellent quality, consistency, and dependable export supply.",
  },
  {
    name: "Sharbati Wheat",
    image: "/images/products/wheat.webp",
    origin: "Madhya Pradesh",
    packaging: "25kg • 50kg",
    markets: "Global",
    description:
      "Premium Sharbati wheat valued for its superior milling quality, rich taste, and suitability for flour mills, bakeries, and food manufacturers.",
  },
];

export default function ExportProducts() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.08),transparent_45%)]" />

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
              Export Product Portfolio
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Premium Indian Agricultural Products

              <span className="block text-green-700">
                Trusted by Global Buyers
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Discover a carefully curated portfolio of premium Indian
              agricultural products sourced through trusted farming and
              manufacturing partners. Every product is selected to meet
              international quality expectations, export requirements,
              and long-term supply commitments.
            </p>
          </motion.div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <motion.div
                key={product.name}
                variants={fadeUpVariants}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
               <div className="relative h-52 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute right-4 top-4 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-green-700 shadow">
                    Export Ready
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-900">
                    {product.name}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {product.description}
                  </p>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <Package className="mt-1 h-5 w-5 text-green-600" />

                      <div>
                        <p className="font-semibold text-slate-900">
                          Packaging Options
                        </p>

                        <p className="text-slate-600">
                          {product.packaging}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Globe2 className="mt-1 h-5 w-5 text-green-600" />

                      <div>
                        <p className="font-semibold text-slate-900">
                          Export Markets
                        </p>

                        <p className="text-slate-600">
                          {product.markets}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-1 h-5 w-5 text-green-600" />

                      <div>
                        <p className="font-semibold text-slate-900">
                          Product Origin
                        </p>

                        <p className="text-slate-600">
                          {product.origin}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                  href="/request-quote"
  className="mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-green-800"
>
                    Request Quote

                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Information */}
          {/* Bottom Information */}
                    <motion.div
            variants={fadeUpVariants}
            className="mt-20 rounded-3xl border border-green-100 bg-gradient-to-r from-green-700 to-green-600 p-10 text-white shadow-xl"
          >
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                  Your Trusted Export Partner
                </span>

                <h3 className="mt-6 text-4xl font-bold">
                  Reliable Sourcing.
                  <br />
                  Reliable Quality.
                  <br />
                  Reliable Delivery.
                </h3>

                <p className="mt-6 text-lg leading-8 text-green-50">
                  Every shipment is supported by disciplined sourcing,
                  quality inspections, export documentation, efficient
                  logistics coordination, and responsive customer
                  communication. Our commitment is to provide buyers with
                  a dependable sourcing experience that builds confidence
                  and long-term business relationships.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold">100%</h4>

                  <p className="mt-2 text-green-100">
                    Export Quality Focus
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold">Trusted</h4>

                  <p className="mt-2 text-green-100">
                    Verified Supply Network
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold">Global</h4>

                  <p className="mt-2 text-green-100">
                    International Market Reach
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold">Reliable</h4>

                  <p className="mt-2 text-green-100">
                    End-to-End Export Support
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