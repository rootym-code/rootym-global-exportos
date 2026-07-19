"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import SectionHeader from "@/components/ui/section-header";

type FAQ = {
  question: string;
  answer: string;
};

const FAQS: FAQ[] = [
  {
    question: "Which countries does ROOTYM export to?",
    answer:
      "ROOTYM serves buyers across the Middle East, Europe, Asia, Africa and other international markets, depending on product availability and import regulations.",
  },
  {
    question: "Can I request customized packaging?",
    answer:
      "Yes. We provide private labeling, customized packaging sizes and export-grade packing based on buyer requirements.",
  },
  {
    question: "What documents are provided with export shipments?",
    answer:
      "Depending on the shipment, ROOTYM provides Commercial Invoice, Packing List, Certificate of Origin, Phytosanitary Certificate, Bill of Lading/AWB and other export documents as required.",
  },
  {
    question: "How do I request a quotation?",
    answer:
      "Simply submit your inquiry with product name, quantity, destination country and preferred Incoterms. Our export team will respond with a detailed quotation.",
  },
  {
    question: "Do you support bulk orders?",
    answer:
      "Yes. ROOTYM specializes in bulk export orders for wholesalers, distributors, supermarkets and food processing companies.",
  },
  {
    question: "How is product quality ensured?",
    answer:
      "Every shipment undergoes quality inspection, export-grade packaging and compliance verification before dispatch.",
  },
];

export default function PremiumFAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <Section spacing="xl">
      <Container size="xl">
        <SectionHeader
          eyebrow="Frequently Asked Questions"
          title="Questions From International Buyers"
          description="Everything you need to know before placing your export order with ROOTYM."
          align="center"
        />

        <div className="mx-auto mt-16 max-w-4xl space-y-5">
          {FAQS.map((faq, index) => {
            const isOpen = index === openIndex;

            return (
              <motion.div
                key={faq.question}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
                className="overflow-hidden rounded-3xl border border-border/50 bg-background/80 backdrop-blur-xl"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(isOpen ? -1 : index)
                  }
                  className="flex w-full items-center justify-between px-8 py-6 text-left transition-colors hover:bg-primary/5"
                >
                  <span className="pr-8 text-lg font-semibold">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-8 pb-8 leading-8 text-muted-foreground">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}