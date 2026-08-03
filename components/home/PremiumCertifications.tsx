"use client";

import { useTranslation } from "@/lib/i18n/context";
import {
  Award,
  BadgeCheck,
  FileCheck2,
  ShieldCheck,
  Star,
  Globe2,
} from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import SectionHeader from "@/components/ui/section-header";
import AnimatedCard from "@/components/ui/animated-card";

type Certification = {
  title: string;
  description: string;
  icon: React.ElementType;
};


const CERTIFICATION_ICONS = [
  Globe2,
  ShieldCheck,
  FileCheck2,
  BadgeCheck,
  Award,
  Star,
];

export default function PremiumCertifications() {
  const { t } = useTranslation();

const CERTIFICATIONS: Certification[] = [
  {
    title: t("certifications.cards.apeda.title"),
    description: t("certifications.cards.apeda.description"),
    icon: CERTIFICATION_ICONS[0],
  },
  {
    title: t("certifications.cards.fssai.title"),
    description: t("certifications.cards.fssai.description"),
    icon: CERTIFICATION_ICONS[1],
  },
  {
    title: t("certifications.cards.iec.title"),
    description: t("certifications.cards.iec.description"),
    icon: CERTIFICATION_ICONS[2],
  },
  {
    title: t("certifications.cards.msme.title"),
    description: t("certifications.cards.msme.description"),
    icon: CERTIFICATION_ICONS[3],
  },
  {
    title: t("certifications.cards.quality.title"),
    description: t("certifications.cards.quality.description"),
    icon: CERTIFICATION_ICONS[4],
  },
  {
    title: t("certifications.cards.trusted.title"),
    description: t("certifications.cards.trusted.description"),
    icon: CERTIFICATION_ICONS[5],
  },
];
  return (
    <Section spacing="xl">
      <Container size="2xl">
        <SectionHeader
         eyebrow={t("certifications.badge")}
         title={t("certifications.title")}
         description={t("certifications.description")}
          align="center"
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {CERTIFICATIONS.map((item, index) => {
            const Icon = item.icon;

            return (
              <AnimatedCard
                key={item.title}
                glow
                delay={index * 0.08}
              >
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 24,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.08,
                  }}
                  className="
                    group
                    relative
                    h-full
                    overflow-hidden
                    rounded-3xl
                    border
                    border-border/50
                    bg-background/80
                    p-8
                    backdrop-blur-xl
                  "
                >
                  {/* Decorative Glow */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
                  </div>

                  <div className="relative z-10">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>

                    <h3 className="text-xl font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-4 leading-7 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatedCard>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}