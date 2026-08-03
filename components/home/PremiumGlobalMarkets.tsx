"use client";
import { useTranslation } from "@/lib/i18n/context";
import {
  ArrowUpRight,
  Globe2,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

import AnimatedCard from "@/components/ui/animated-card";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import SectionHeader from "@/components/ui/section-header";

type Market = {
  region: string;
  countries: string[];
  color: string;
};

const MARKET_COLORS = [
  "from-emerald-500/10 to-primary/10",
  "from-blue-500/10 to-primary/10",
  "from-amber-500/10 to-primary/10",
  "from-violet-500/10 to-primary/10",
];

export default function PremiumGlobalMarkets() {
  const { t } = useTranslation();

const MARKETS: Market[] = [
  {
    region: t("globalMarkets.markets.middleEast.region"),
    countries: [
      t("globalMarkets.markets.middleEast.countries.uae"),
      t("globalMarkets.markets.middleEast.countries.saudi"),
      t("globalMarkets.markets.middleEast.countries.qatar"),
      t("globalMarkets.markets.middleEast.countries.oman"),
      t("globalMarkets.markets.middleEast.countries.kuwait"),
    ],
    color: MARKET_COLORS[0],
  },
  {
    region: t("globalMarkets.markets.europe.region"),
    countries: [
      t("globalMarkets.markets.europe.countries.uk"),
      t("globalMarkets.markets.europe.countries.germany"),
      t("globalMarkets.markets.europe.countries.france"),
      t("globalMarkets.markets.europe.countries.netherlands"),
    ],
    color: MARKET_COLORS[1],
  },
  {
    region: t("globalMarkets.markets.asia.region"),
    countries: [
      t("globalMarkets.markets.asia.countries.srilanka"),
      t("globalMarkets.markets.asia.countries.singapore"),
      t("globalMarkets.markets.asia.countries.malaysia"),
      t("globalMarkets.markets.asia.countries.vietnam"),
    ],
    color: MARKET_COLORS[2],
  },
  {
    region: t("globalMarkets.markets.northAmerica.region"),
    countries: [
      t("globalMarkets.markets.northAmerica.countries.usa"),
      t("globalMarkets.markets.northAmerica.countries.canada"),
    ],
    color: MARKET_COLORS[3],
  },
];
  return (
    <Section spacing="xl">
      <Container size="2xl">
        <SectionHeader
      eyebrow={t("globalMarkets.badge")}
      title={t("globalMarkets.title")}
      description={t("globalMarkets.description")}
          align="center"
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {MARKETS.map((market, index) => (
            <AnimatedCard
              key={market.region}
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
                className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background/80 backdrop-blur-xl"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${market.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />

                <div className="relative z-10 p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <Globe2 className="h-8 w-8 text-primary" />
                    </div>

                    <ArrowUpRight className="h-6 w-6 text-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>

                  <h3 className="text-2xl font-bold">
                    {market.region}
                  </h3>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {market.countries.map((country) => (
                      <div
                        key={country}
                        className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-medium"
                      >
                        <MapPin className="h-4 w-4 text-primary" />
                        {country}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatedCard>
          ))}
        </div>
      </Container>
    </Section>
  );
}