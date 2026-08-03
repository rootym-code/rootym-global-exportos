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
      "Corporate Headquarters",
    ],
  },
  {
    icon: MapPin,
    title: "Operations Office",
    details: [
      "Kaimur, Bihar, India",
      "Agricultural Sourcing & Procurement",
      "Farmer Network Operations",
    ],
  },
  {
    icon: Mail,
    title: "Business Email",
    details: [
      "sales@rootym.com",
      "Export Enquiries",
      "Partnership Opportunities",
    ],
  },
  {
    icon: Phone,
    title: "Business Support",
    details: [
      "+91 98735 29752",
      "Import & Export Assistance",
      "Monday - Saturday",
    ],
  },
];

const registrations = [
  {
    icon: ShieldCheck,
    title: "APEDA Registered",
    description:
      "Registered agricultural exporter committed to international quality standards and responsible export practices.",
  },
  {
    icon: FileCheck2,
    title: "IEC Certified",
    description:
      "Authorized Import Export Code (IEC) holder, enabling seamless global trade and international shipments.",
  },
  {
    icon: Globe2,
    title: "Global Trade Partner",
    description:
      "Supporting importers, distributors, wholesalers, retailers, and private label brands across international markets.",
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

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Let's Connect and
              <span className="block text-green-700">
                Build Long-Term Partnerships
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Whether you are looking for premium agricultural products, bulk
              sourcing, OEM/private label solutions, or long-term export
              partnerships, our experienced team is ready to assist you with
              responsive communication and reliable support.
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
                      <p key={detail} className="text-gray-600">
                        {detail}
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
              Trusted Export Partner
            </h3>

            <p className="mt-4 leading-8 text-gray-600">
              ROOTYM is committed to transparency, regulatory compliance, and
              delivering premium-quality agricultural products that meet the
              expectations of customers across global markets.
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