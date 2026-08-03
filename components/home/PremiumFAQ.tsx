"use client";
import { useTranslation } from "@/lib/i18n/context";
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

const FAQ_KEYS = [
  "faq1",
  "faq2",
  "faq3",
  "faq4",
  "faq5",
  "faq6",
] as const;

export default function PremiumFAQ() {
  const { t } = useTranslation();

const FAQS: FAQ[] = FAQ_KEYS.map((key) => ({
  question: t(`faq.questions.${key}.question`),
  answer: t(`faq.questions.${key}.answer`),
}));
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <Section spacing="xl">
      <Container size="xl">
        <SectionHeader
        eyebrow={t("faq.badge")}
        title={t("faq.title")}
        description={t("faq.description")}
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