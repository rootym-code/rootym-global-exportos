"use client";

import { motion, type Variants } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  Globe2,
  Mail,
  MessageSquare,
  User,
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

const benefits = [
  "Export consultation support",
  "Product availability guidance",
  "Bulk order discussions",
  "International partnership support",
];

export default function ContactForm() {
  return (
    <section
      id="contact-form"
      className="bg-gradient-to-b from-green-50 to-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-12 lg:grid-cols-2 lg:items-start"
        >
          {/* Left Content */}

          <motion.div variants={itemVariants}>
            <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
              Business Enquiry
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Let's Discuss Your
              <span className="block text-green-700">
                Export Requirements
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Share your requirements with our team. Whether you are looking
              for bulk agricultural products, sourcing partnerships or export
              solutions, we will help you with the right information.
            </p>

            <div className="mt-10 space-y-5">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-700" />

                  <span className="text-gray-700">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}

          <motion.div
            variants={itemVariants}
            className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl lg:p-10"
          >
            <form className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Name
                  </label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Company
                  </label>

                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      placeholder="Company name"
                      className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="email"
                    placeholder="Business email"
                    className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Country
                </label>

                <div className="relative">
                  <Globe2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Country"
                    className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Message
                </label>

                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-gray-400" />

                  <textarea
                    rows={5}
                    placeholder="Tell us about your requirements"
                    className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-green-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-green-700 px-6 py-4 font-semibold text-white transition-all duration-300 hover:bg-green-800"
              >
                Submit Enquiry
              </button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}