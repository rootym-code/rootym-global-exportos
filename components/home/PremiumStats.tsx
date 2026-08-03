"use client";

import { Globe2, ShieldCheck, Ship, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

import AnimatedCard from "@/components/ui/animated-card";
import { useTranslation } from "@/lib/i18n/context";

type PremiumStat = {
  label: string;
  value: string;
  icon: React.ElementType;
};

export default function PremiumStats() {
  const { t } = useTranslation();

  const STATS: PremiumStat[] = [
    {
      label: t("stats.countries"),
      value: "25+",
      icon: Globe2,
    },
    {
      label: t("stats.products"),
      value: "50+",
      icon: Ship,
    },
    {
      label: t("stats.quality"),
      value: "100%",
      icon: ShieldCheck,
    },
    {
      label: t("stats.support"),
      value: "24×7",
      icon: TrendingUp,
    },
  ];

  return (
    <section className="mt-20">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((item, index) => {
          const Icon = item.icon;

          return (
            <AnimatedCard
              key={item.label}
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
                className="group relative overflow-hidden rounded-3xl border border-border/50 bg-background/80 p-6 backdrop-blur-xl"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
                </div>

                <div className="relative z-10">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>

                  <motion.div
                    initial={{ scale: 0.92 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.3,
                    }}
                    className="text-4xl font-extrabold tracking-tight"
                  >
                    {item.value}
                  </motion.div>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              </motion.div>
            </AnimatedCard>
          );
        })}
      </div>
    </section>
  );
}