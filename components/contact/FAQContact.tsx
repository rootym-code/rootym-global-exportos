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
    question: "How can I start a business enquiry with ROOTYM?",
    answer:
      "You can contact us through the enquiry form, email, or request a quotation directly from our website. Our export team will connect with you regarding your requirements.",
  },
  {
    question: "Which agricultural products does ROOTYM export?",
    answer:
      "ROOTYM focuses on premium Indian agricultural products including Makhana, dehydrated onion products, rice, wheat and other export-ready food products.",
  },
  {
    question: "Do you support bulk export orders?",
    answer:
      "Yes. We work with international buyers, wholesalers and distributors for bulk requirements with suitable packaging and export documentation support.",
  },
  {
    question: "Which countries do you serve?",
    answer:
      "ROOTYM is building partnerships across UAE, Middle East, Sri Lanka, Europe, Africa and other international markets.",
  },
  {
    question: "Can you provide product specifications and certifications?",
    answer:
      "Yes. Product specifications, compliance documents and certification details can be shared based on customer requirements.",
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