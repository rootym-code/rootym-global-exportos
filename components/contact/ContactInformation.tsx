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
    title: "Registered Office",
    details: [
      "ROOTYM Agro Harvest Private Limited",
      "Pune, Maharashtra, India",
    ],
  },
  {
    icon: MapPin,
    title: "Branch Office",
    details: [
      "Kaimur, Bihar, India",
      "Agricultural Sourcing & Operations",
    ],
  },
  {
    icon: Mail,
    title: "Email",
    details: [
      "sales@rootym.com",
      "Export enquiries & partnerships",
    ],
  },
  {
    icon: Phone,
    title: "Phone",
    details: [
      "+91 XXXXX XXXXX",
      "Business enquiries",
    ],
  },
];

const registrations = [
  {
    icon: ShieldCheck,
    title: "APEDA Registered",
    description:
      "Authorized for agricultural and processed food exports.",
  },
  {
    icon: FileCheck2,
    title: "IEC Registered",
    description:
      "Enabled for international import-export operations.",
  },
  {
    icon: Globe2,
    title: "Global Export Focus",
    description:
      "Serving international buyers and business partners.",
  },
];

export default function ContactInformation() {
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
              Contact Information
            </span>

            <h2
              className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl"
            >
              Connect With
              <span className="block text-green-700">
                ROOTYM
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our team is ready to support international buyers, distributors,
              wholesalers and strategic partners with reliable agricultural
              sourcing and export solutions.
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
                    {item.title}
                  </h3>

                  <div className="mt-4 space-y-2">
                    {item.details.map((detail) => (
                      <p
                        key={detail}
                        className="text-gray-600"
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Registration Trust Cards */}

          <motion.div
            variants={containerVariants}
            className="mt-16 grid gap-6 md:grid-cols-3"
          >
            {registrations.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className="rounded-3xl bg-gradient-to-br from-green-50 to-white p-8"
                >
                  <div className="inline-flex rounded-xl bg-green-100 p-3">
                    <Icon className="h-6 w-6 text-green-700" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-600">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}