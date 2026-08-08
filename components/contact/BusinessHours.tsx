"use client";

import { motion, type Variants } from "framer-motion";
import {
  Clock3,
  Headphones,
  MailCheck,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

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

const supportDetails = [
  {
    icon: Clock3,
    title: "contact.support.cards.hours.title",
    description: "contact.support.cards.hours.description",
  },
  {
    icon: MailCheck,
    title: "contact.support.cards.response.title",
    description: "contact.support.cards.response.description",
  },
  {
    icon: Headphones,
    title: "contact.support.cards.team.title",
    description: "contact.support.cards.team.description",
  },
  {
    icon: ShieldCheck,
    title: "contact.support.cards.communication.title",
    description: "contact.support.cards.communication.description",
  },
];

export default function BusinessHours() {
  const { t } = useTranslation();

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
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
            {t("contact.support.badge")}
          </span>

          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {t("contact.support.title.line1")}

            <span className="block text-green-700">
              {t("contact.support.title.line2")}
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t("contact.support.description")}
          </p>
        </motion.div>

        {/* Support Cards */}

        <motion.div
          variants={containerVariants}
          className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4"
        >
          {supportDetails.map((item) => {
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

                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {t(item.title)}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">
                  {t(item.description)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Contact Message */}

        <motion.div
          variants={itemVariants}
          className="mt-16 rounded-3xl border border-green-200 bg-white p-10 text-center shadow-sm"
        >
          <MessageSquare className="mx-auto h-12 w-12 text-green-700" />

          <h3 className="mt-6 text-3xl font-bold text-gray-900">
            {t("contact.support.question.title")}
          </h3>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-gray-600">
            {t("contact.support.question.description")}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}