"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import Card from "@/components/ui/Card";
import SectionContainer from "@/components/ui/SectionContainer";
import SectionHeading from "@/components/ui/SectionHeading";

import { faqs } from "@/data/faqs";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <SectionContainer className="bg-gray-50">
      <SectionHeading
        badge="Frequently Asked Questions"
        title="Answers to Common Buyer Questions"
        description="Find quick answers to the questions most frequently asked by importers before starting an export partnership with ROOTYM."
      />

      <div className="mx-auto mt-16 max-w-4xl space-y-5">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <Card
              key={faq.question}
              hover={false}
              className="overflow-hidden"
            >
              <button
                type="button"
                onClick={() =>
                  setOpenIndex(isOpen ? null : index)
                }
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </span>

                <ChevronDown
                  className={`h-6 w-6 text-[#2E7D32] transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-gray-200 px-6 py-5">
                  <p className="leading-8 text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </SectionContainer>
  );
}