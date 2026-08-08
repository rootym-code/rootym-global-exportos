"use client";

import { motion, type Variants } from "framer-motion";
import {
  Building2,
  Factory,
  Globe2,
  MapPin,
} from "lucide-react";

import { useTranslation } from "@/lib/i18n/context";

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
    title: "contact.locations.offices.registered.title",
    location: "contact.locations.offices.registered.location",
    description: "contact.locations.offices.registered.description",
    highlights: [
      "contact.locations.offices.registered.highlights.corporate",
      "contact.locations.offices.registered.highlights.export",
      "contact.locations.offices.registered.highlights.business",
      "contact.locations.offices.registered.highlights.support",
    ],
  },
  {
    icon: Factory,
    title: "contact.locations.offices.branch.title",
    location: "contact.locations.offices.branch.location",
    description: "contact.locations.offices.branch.description",
    highlights: [
      "contact.locations.offices.branch.highlights.sourcing",
      "contact.locations.offices.branch.highlights.farmer",
      "contact.locations.offices.branch.highlights.quality",
      "contact.locations.offices.branch.highlights.supply",
    ],
  },
];

export default function OfficeLocations() {
  const { t } = useTranslation();

  return (
    <section>
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
            {t("contact.locations.badge")}
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {t("contact.locations.title.line1")}

            <span className="block text-green-700">
              {t("contact.locations.title.line2")}
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t("contact.locations.description")}
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
                      {t("contact.locations.map.title")}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      {t("contact.locations.map.description")}
                    </p>
                  </div>
                </div>

                {/* Content */}

                <div className="p-8">
                  <div className="inline-flex rounded-xl bg-green-100 p-3">
                    <Icon className="h-6 w-6 text-green-700" />
                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-gray-900">
                    {t(office.title)}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-green-700">
                    <MapPin className="h-4 w-4" />

                    <span className="font-medium">
                      {t(office.location)}
                    </span>
                  </div>

                  <p className="mt-6 leading-7 text-gray-600">
                    {t(office.description)}
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-3">
                    {office.highlights.map((item) => (
                      <div
                        key={item}
                        className="rounded-xl bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700"
                      >
                        {t(item)}
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
            {t("contact.locations.global.title")}
          </h3>

          <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-green-100">
            {t("contact.locations.global.description")}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}