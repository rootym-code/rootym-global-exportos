/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : Home
 * Feature     : Premium Hero
 * Purpose     : Displays the premium homepage hero with
 *               optional Website-specific content while
 *               preserving existing translated fallbacks.
 * ============================================================
 */

"use client";

import { useTranslation } from "@/lib/i18n/context";

import { useCompanySettings } from "@/lib/cms/company-settings";

import { ArrowRight, Globe2 } from "lucide-react";

import { motion } from "framer-motion";

import Container from "@/components/ui/container";

import Section from "@/components/ui/section";

import PremiumButton from "@/components/ui/premium-button";

import PremiumHeroVisual from "./PremiumHeroVisual";

import PremiumStats from "./PremiumStats";

export type PremiumHeroProps = {
  /**
   * ============================================================
   * Website-specific Hero tagline.
   *
   * Falls back to the existing CMS company tagline,
   * then to the translated Hero badge.
   * ============================================================
   */
  websiteTagline?: string | null;

  /**
   * ============================================================
   * Website-specific Hero title line 1.
   *
   * Falls back to the existing translated Hero title.
   * ============================================================
   */
  websiteTitleLine1?: string | null;

  /**
   * ============================================================
   * Website-specific Hero title line 2.
   *
   * Falls back to the existing translated Hero title.
   * ============================================================
   */
  websiteTitleLine2?: string | null;

  /**
   * ============================================================
   * Website-specific Hero description.
   *
   * Falls back to the existing translated Hero description.
   *
   * This remains separate from Company Description.
   * ============================================================
   */
  websiteDescription?: string | null;

  /**
   * ============================================================
   * Website-specific Company Description.
   *
   * This is passed to the right-side Global Export Panel.
   *
   * It is intentionally separate from websiteDescription.
   * ============================================================
   */
  companyDescription?: string | null;

  /**
   * ============================================================
   * Website-specific business name.
   *
   * Used by the right-side Global Export Panel.
   * ============================================================
   */
  websiteCompanyName?: string | null;
};

export default function PremiumHero({
  websiteTagline,
  websiteTitleLine1,
  websiteTitleLine2,
  websiteDescription,
  companyDescription,
  websiteCompanyName,
}: PremiumHeroProps) {
  const { t } = useTranslation();

  /**
   * Existing global company settings remain available as
   * fallback values for the ROOTYM global Website.
   */
  const { tagline: globalTagline } =
    useCompanySettings();

  /**
   * ------------------------------------------------------------
   * Website-aware content resolution
   * ------------------------------------------------------------
   *
   * Customer Website values always win when supplied.
   *
   * Existing global/translatable values remain the fallback
   * so the current ROOTYM homepage is not broken.
   */

  const resolvedTagline =
    websiteTagline?.trim() ||
    globalTagline?.trim() ||
    t("hero.badge");

  const resolvedTitleLine1 =
    websiteTitleLine1?.trim() ||
    t("hero.title.line1");

  const resolvedTitleLine2 =
    websiteTitleLine2?.trim() ||
    t("hero.title.line2");

  const resolvedDescription =
    websiteDescription?.trim() ||
    t("hero.description");

  return (
    <Section
      spacing="xl"
      background="gradient"
      className="relative overflow-hidden"
    >
      {/* Background Effects */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-[32rem] w-[32rem] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <Container size="2xl">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Left */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="space-y-8"
          >
            {/* Website / CMS Tagline */}

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-semibold text-primary">
              <Globe2 className="h-4 w-4" />

              {resolvedTagline}
            </div>

            <div className="space-y-6">

              <h1 className="text-5xl font-extrabold leading-tight tracking-tight lg:text-7xl">
                {resolvedTitleLine1}

                <span className="block bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                  {resolvedTitleLine2}
                </span>
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                {resolvedDescription}
              </p>

            </div>

            {/* CTA Buttons */}

            <div className="flex flex-wrap gap-4">

              <PremiumButton
                size="xl"
                rightIcon={
                  <ArrowRight className="h-5 w-5" />
                }
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

            {/* Hero Features */}

            <div className="flex flex-wrap items-center gap-8 pt-4 text-sm text-muted-foreground">

              <div>
                ✔ {t("hero.features.exportReady")}
              </div>

              <div>
                ✔ {t("hero.features.apeda")}
              </div>

              <div>
                ✔ {t("hero.features.quality")}
              </div>

              <div>
                ✔ {t("hero.features.logistics")}
              </div>

            </div>
          </motion.div>

          {/* Right */}

          <PremiumHeroVisual
            websiteCompanyName={websiteCompanyName}
            websiteTagline={websiteTagline}
            websiteDescription={websiteDescription}
            companyDescription={companyDescription}
          />

        </div>

        {/* Premium Statistics */}

        <PremiumStats />

      </Container>
    </Section>
  );
}