"use client";

import { motion, type Variants } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

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
    question: "contact.faq.questions.quotation.question",
    answer: "contact.faq.questions.quotation.answer",
  },
  {
    question: "contact.faq.questions.products.question",
    answer: "contact.faq.questions.products.answer",
  },
  {
    question: "contact.faq.questions.bulkOrders.question",
    answer: "contact.faq.questions.bulkOrders.answer",
  },
  {
    question: "contact.faq.questions.countries.question",
    answer: "contact.faq.questions.countries.answer",
  },
  {
    question: "contact.faq.questions.documentation.question",
    answer: "contact.faq.questions.documentation.answer",
  },
  {
    question: "contact.faq.questions.packaging.question",
    answer: "contact.faq.questions.packaging.answer",
  },
];

export default function FAQContact() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
            <HelpCircle className="h-4 w-4" />

            {t("contact.faq.badge")}
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {t("contact.faq.title.line1")}

            <span className="block text-green-700">
              {t("contact.faq.title.line2")}
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t("contact.faq.description")}
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
                    {t(faq.question)}
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
                      {t(faq.answer)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}