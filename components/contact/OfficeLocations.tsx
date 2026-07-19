"use client";

import { motion, type Variants } from "framer-motion";
import {
  Building2,
  Factory,
  Globe2,
  MapPin,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const offices = [
  {
    icon: Building2,
    title: "Registered Office",
    location: "Pune, Maharashtra",
    description:
      "Corporate headquarters responsible for business operations, export management, customer relationships and strategic planning.",
    highlights: [
      "Corporate Office",
      "Export Management",
      "Business Development",
      "Customer Support",
    ],
  },
  {
    icon: Factory,
    title: "Branch Office",
    location: "Kaimur, Bihar",
    description:
      "Strategically located close to agricultural sourcing regions, supporting procurement, supplier coordination and quality assurance.",
    highlights: [
      "Product Sourcing",
      "Farmer Network",
      "Quality Inspection",
      "Supply Chain",
    ],
  },
];

export default function OfficeLocations() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Heading */}

          <motion.div
            variants={itemVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
              Our Locations
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Serving Customers
              <span className="block text-green-700">
                Across India & Worldwide
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              ROOTYM operates from strategically located offices that support
              efficient sourcing, quality management and international export
              operations.
            </p>
          </motion.div>

          {/* Office Cards */}

          <motion.div
            variants={containerVariants}
            className="mt-16 grid gap-8 lg:grid-cols-2"
          >
            {offices.map((office) => {
              const Icon = office.icon;

              return (
                <motion.div
                  key={office.title}
                  variants={itemVariants}
                  className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl"
                >
                  {/* Map Placeholder */}

                  <div className="flex h-56 items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-white">
                    <div className="text-center">
                      <MapPin className="mx-auto h-12 w-12 text-green-700" />

                      <p className="mt-4 font-semibold text-gray-700">
                        Interactive Map
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        Google Maps integration will be added in Sprint 10
                      </p>
                    </div>
                  </div>

                  {/* Content */}

                  <div className="p-8">
                    <div className="inline-flex rounded-xl bg-green-100 p-3">
                      <Icon className="h-6 w-6 text-green-700" />
                    </div>

                    <h3 className="mt-5 text-2xl font-bold text-gray-900">
                      {office.title}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-green-700">
                      <MapPin className="h-4 w-4" />

                      <span className="font-medium">
                        {office.location}
                      </span>
                    </div>

                    <p className="mt-6 leading-7 text-gray-600">
                      {office.description}
                    </p>

                    <div className="mt-8 grid grid-cols-2 gap-3">
                      {office.highlights.map((item) => (
                        <div
                          key={item}
                          className="rounded-xl bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Global Presence */}

          <motion.div
            variants={itemVariants}
            className="mt-20 rounded-3xl bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 p-10 text-center text-white shadow-2xl"
          >
            <Globe2 className="mx-auto h-12 w-12 text-green-300" />

            <h3 className="mt-6 text-3xl font-bold">
              Global Export Network
            </h3>

            <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-green-100">
              From our operations in Maharashtra and Bihar, ROOTYM serves
              international buyers by connecting India's agricultural excellence
              with markets around the world through reliable sourcing,
              documentation and export management.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}