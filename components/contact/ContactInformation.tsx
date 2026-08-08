"use client";

import { motion, type Variants } from "framer-motion";
import {
  Building2,
  FileCheck2,
  Globe2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
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

const contactDetails = [
  {
    icon: Building2,
    title: "contact.information.cards.registeredOffice.title",
    details: [
      "contact.information.cards.registeredOffice.details.company",
      "contact.information.cards.registeredOffice.details.location",
      "contact.information.cards.registeredOffice.details.type",
    ],
  },
  {
    icon: MapPin,
    title: "contact.information.cards.operationsOffice.title",
    details: [
      "contact.information.cards.operationsOffice.details.location",
      "contact.information.cards.operationsOffice.details.operations",
      "contact.information.cards.operationsOffice.details.network",
    ],
  },
  {
    icon: Mail,
    title: "contact.information.cards.businessEmail.title",
    details: [
      "contact.information.cards.businessEmail.details.email",
      "contact.information.cards.businessEmail.details.enquiries",
      "contact.information.cards.businessEmail.details.partnerships",
    ],
  },
  {
    icon: Phone,
    title: "contact.information.cards.businessSupport.title",
    details: [
      "contact.information.cards.businessSupport.details.phone",
      "contact.information.cards.businessSupport.details.assistance",
      "contact.information.cards.businessSupport.details.hours",
    ],
  },
];

const registrations = [
  {
    icon: ShieldCheck,
    title: "contact.information.registrations.apeda.title",
    description: "contact.information.registrations.apeda.description",
  },
  {
    icon: FileCheck2,
    title: "contact.information.registrations.iec.title",
    description: "contact.information.registrations.iec.description",
  },
  {
    icon: Globe2,
    title: "contact.information.registrations.global.title",
    description: "contact.information.registrations.global.description",
  },
];

export default function ContactInformation() {
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
            {t("contact.information.badge")}
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {t("contact.information.title.line1")}

            <span className="block text-green-700">
              {t("contact.information.title.line2")}
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t("contact.information.description")}
          </p>
        </motion.div>

        {/* Contact Cards */}

        <motion.div
          variants={containerVariants}
          className="mt-16 grid gap-8 md:grid-cols-2"
        >
          {contactDetails.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl"
              >
                <div className="inline-flex rounded-2xl bg-green-100 p-4">
                  <Icon className="h-7 w-7 text-green-700" />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-gray-900">
                  {t(item.title)}
                </h3>

                <div className="mt-4 space-y-2">
                  {item.details.map((detail) => (
                    <p key={detail} className="text-gray-600">
                      {t(detail)}
                    </p>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust Section */}

        <motion.div
          variants={itemVariants}
          className="mx-auto mt-20 max-w-3xl text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900">
            {t("contact.information.trust.title")}
          </h3>

          <p className="mt-4 leading-8 text-gray-600">
            {t("contact.information.trust.description")}
          </p>
        </motion.div>

        {/* Registration Cards */}

        <motion.div
          variants={containerVariants}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {registrations.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="inline-flex rounded-xl bg-green-100 p-3">
                  <Icon className="h-6 w-6 text-green-700" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  {t(item.title)}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {t(item.description)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}