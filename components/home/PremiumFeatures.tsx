/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : Home
 * Feature     : Premium Features
 * Purpose     : Displays the feature section using translated
 *               content while allowing the tenant business name
 *               to replace ROOTYM in customer Websites.
 * ============================================================
 */

"use client";

import { useTranslation } from "@/lib/i18n/context";

import {
  BadgeCheck,
  Globe2,
  Leaf,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

import AnimatedCard from "@/components/ui/animated-card";
import Section from "@/components/ui/section";
import Container from "@/components/ui/container";
import SectionHeader from "@/components/ui/section-header";

type Feature = {
  title: string;
  description: string;
  icon: React.ElementType;
};

export type PremiumFeaturesProps = {
  /**
   * Tenant business name used on customer Websites.
   *
   * Falls back to ROOTYM when not provided so the existing
   * global ROOTYM Website remains unchanged.
   */
  websiteCompanyName?: string | null;
};

export default function PremiumFeatures({
  websiteCompanyName,
}: PremiumFeaturesProps) {
  const { t } = useTranslation();

  const resolvedCompanyName =
    websiteCompanyName?.trim() || "ROOTYM";

  const replaceCompanyName = (value: string) =>
    value.replace(/ROOTYM/g, resolvedCompanyName);

  const FEATURES: Feature[] = [
    {
      title: replaceCompanyName(
        t("features.cards.quality.title"),
      ),
      description: replaceCompanyName(
        t("features.cards.quality.description"),
      ),
      icon: BadgeCheck,
    },
    {
      title: replaceCompanyName(
        t("features.cards.export.title"),
      ),
      description: replaceCompanyName(
        t("features.cards.export.description"),
      ),
      icon: Globe2,
    },
    {
      title: replaceCompanyName(
        t("features.cards.farming.title"),
      ),
      description: replaceCompanyName(
        t("features.cards.farming.description"),
      ),
      icon: Leaf,
    },
    {
      title: replaceCompanyName(
        t("features.cards.certified.title"),
      ),
      description: replaceCompanyName(
        t("features.cards.certified.description"),
      ),
      icon: ShieldCheck,
    },
    {
      title: replaceCompanyName(
        t("features.cards.logistics.title"),
      ),
      description: replaceCompanyName(
        t("features.cards.logistics.description"),
      ),
      icon: Truck,
    },
    {
      title: replaceCompanyName(
        t("features.cards.support.title"),
      ),
      description: replaceCompanyName(
        t("features.cards.support.description"),
      ),
      icon: Users,
    },
  ];

  return (
    <Section spacing="xl">
      <Container size="2xl">
        <SectionHeader
          eyebrow={replaceCompanyName(
            t("features.badge"),
          )}
          title={replaceCompanyName(
            t("features.title"),
          )}
          description={replaceCompanyName(
            t("features.description"),
          )}
          align="center"
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <AnimatedCard
                key={feature.title}
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
                    amount: 0.3,
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
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
                  </div>

                  <div className="relative z-10">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>

                    <h3 className="text-xl font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-4 leading-7 text-muted-foreground">
                      {feature.description}
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