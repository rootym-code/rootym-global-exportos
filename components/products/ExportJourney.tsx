"use client";

import { motion, type Variants } from "framer-motion";

import { useTranslation } from "@/lib/i18n/context";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const steps = [
  {
    number: "01",
    title: "products.exportJourney.steps.sourcing.title",
    description:
      "products.exportJourney.steps.sourcing.description",
  },
  {
    number: "02",
    title: "products.exportJourney.steps.inspection.title",
    description:
      "products.exportJourney.steps.inspection.description",
  },
  {
    number: "03",
    title: "products.exportJourney.steps.packaging.title",
    description:
      "products.exportJourney.steps.packaging.description",
  },
  {
    number: "04",
    title: "products.exportJourney.steps.documentation.title",
    description:
      "products.exportJourney.steps.documentation.description",
  },
  {
    number: "05",
    title: "products.exportJourney.steps.shipment.title",
    description:
      "products.exportJourney.steps.shipment.description",
  },
  {
    number: "06",
    title: "products.exportJourney.steps.delivery.title",
    description:
      "products.exportJourney.steps.delivery.description",
  },
];

export default function ExportJourney() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div
          variants={fadeUpVariants}
          className="text-center"
        >
          <span className="font-semibold uppercase tracking-[0.25em] text-[#2E7D32]">
            {t("products.exportJourney.badge")}
          </span>

          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            {t("products.exportJourney.title")}
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            {t("products.exportJourney.description")}
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3 xl:grid-cols-6">
        {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={fadeUpVariants}
            >
              <JourneyStep
                number={step.number}
                title={t(step.title)}
                description={t(step.description)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function JourneyStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-green-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 font-bold text-[#2E7D32]">
        {number}
      </div>

      <h3 className="mt-5 font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
}