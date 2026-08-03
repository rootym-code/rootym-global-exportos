"use client";

import { useTranslation } from "@/lib/i18n/context";
import { ArrowRight, Globe2 } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import PremiumButton from "@/components/ui/premium-button";

import PremiumHeroVisual from "./PremiumHeroVisual";
import PremiumStats from "./PremiumStats";

export default function PremiumHero() {
  const { t } = useTranslation();

  return (
    <Section
      spacing="xl"
      background="gradient"
      className="relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[32rem] w-[32rem] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <Container size="2xl">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-semibold text-primary">
              <Globe2 className="h-4 w-4" />
              {t("hero.badge")}
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl font-extrabold leading-tight tracking-tight lg:text-7xl">
                {t("hero.title.line1")}
                <span className="block bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                  {t("hero.title.line2")}
                </span>
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                {t("hero.description")}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <PremiumButton
                size="xl"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                {t("hero.buttons.explore")}
              </PremiumButton>

              <PremiumButton
                variant="outline"
                size="xl"
              >
                {t("hero.buttons.quote")}
              </PremiumButton>
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-4 text-sm text-muted-foreground">
              <div>✔ {t("hero.features.exportReady")}</div>
              <div>✔ {t("hero.features.apeda")}</div>
              <div>✔ {t("hero.features.quality")}</div>
              <div>✔ {t("hero.features.logistics")}</div>
            </div>
          </motion.div>

          {/* Right */}
          <PremiumHeroVisual />
        </div>

        {/* Premium Statistics */}
        <PremiumStats />
      </Container>
    </Section>
  );
}