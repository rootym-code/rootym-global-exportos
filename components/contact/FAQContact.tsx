"use client";

import { motion, type Variants } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

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
    y: 25,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const faqs = [
  {
    question: "How do I request a quotation from ROOTYM?",
    answer:
      "Simply complete the enquiry form on this page with your product requirements, destination country, estimated quantity, and packaging preferences. Our export team will review your enquiry and respond with a suitable quotation and next steps.",
  },
  {
    question: "Which products are available for export?",
    answer:
      "ROOTYM supplies premium Indian agricultural products including Makhana (Fox Nuts), dehydrated onion products, rice, wheat, potato products, and other export-ready commodities. Product availability may vary based on season and sourcing.",
  },
  {
    question: "Do you handle bulk and container-load orders?",
    answer:
      "Yes. We specialize in bulk supply for importers, distributors, wholesalers, retailers, food manufacturers, and private label businesses. Both palletized and container-load shipments can be discussed based on your requirements.",
  },
  {
    question: "Which countries does ROOTYM export to?",
    answer:
      "We are expanding our global network and welcome enquiries from buyers across the UAE, Middle East, Sri Lanka, Europe, Africa, Asia, and other international markets.",
  },
  {
    question: "Can you provide export documentation and certifications?",
    answer:
      "Yes. Depending on the destination country and product, we can provide the required export documentation and applicable certifications to support customs clearance and regulatory compliance.",
  },
  {
    question: "Can I request customized packaging or private labeling?",
    answer:
      "Yes. We support OEM and private label opportunities for eligible products. Packaging formats, branding requirements, and minimum order quantities can be discussed with our export team.",
  },
];

export default function FAQContact() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {/* Heading */}

          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
              <HelpCircle className="h-4 w-4" />
              Frequently Asked Questions
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Before You
              <span className="block text-green-700">
                Contact Us
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Find answers to common questions about our export services,
              products and business partnerships.
            </p>
          </motion.div>

          {/* FAQ Items */}

          <motion.div
            variants={containerVariants}
            className="mt-12 space-y-4"
          >
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  key={faq.question}
                  variants={itemVariants}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-4 p-6 text-left"
                  >
                    <span className="text-lg font-semibold text-gray-900">
                      {faq.question}
                    </span>

                    <ChevronDown
                      className={`h-5 w-5 flex-shrink-0 text-green-700 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 leading-7 text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}