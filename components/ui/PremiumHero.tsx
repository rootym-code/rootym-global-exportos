"use client";

import { ArrowRight, Globe2, ShieldCheck, Ship, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import AnimatedCard from "@/components/ui/animated-card";
import PremiumButton from "@/components/ui/premium-button";

const stats = [
  {
    label: "Countries Targeted",
    value: "25+",
    icon: Globe2,
  },
  {
    label: "Export Products",
    value: "50+",
    icon: Ship,
  },
  {
    label: "Quality Compliance",
    value: "100%",
    icon: ShieldCheck,
  },
  {
    label: "Business Growth",
    value: "24x7",
    icon: TrendingUp,
  },
];

export default function PremiumHero() {
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
              Rooted in India. Trusted Worldwide.
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl font-extrabold leading-tight tracking-tight lg:text-7xl">
                Premium Indian
                <span className="block bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                  Agricultural Exports
                </span>
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                ROOTYM connects global buyers with high-quality Indian
                agricultural products through a modern export platform,
                transparent sourcing, quality assurance, and dependable
                logistics.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <PremiumButton
                size="xl"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Explore Products
              </PremiumButton>

              <PremiumButton
                variant="outline"
                size="xl"
              >
                Request Quote
              </PremiumButton>
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-4 text-sm text-muted-foreground">
              <div>✔ Export Ready</div>
              <div>✔ APEDA Registered</div>
              <div>✔ Premium Quality</div>
              <div>✔ Global Logistics</div>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <AnimatedCard
              glow
              className="rounded-[32px] border border-border/50 bg-background/70 p-8 backdrop-blur-xl"
            >
              <div className="aspect-square rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/5 via-background to-emerald-500/5">

                {/* Placeholder for Sprint 9 Globe */}
                <div className="flex h-full flex-col items-center justify-center gap-6">

                  <div className="flex h-36 w-36 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                    <Globe2 className="h-20 w-20 text-primary" />
                  </div>

                  <div className="text-center">
                    <h3 className="text-2xl font-bold">
                      Global Export Network
                    </h3>

                    <p className="mt-2 text-muted-foreground">
                      Connecting Indian agriculture with international markets.
                    </p>
                  </div>

                </div>

              </div>
            </AnimatedCard>
          </motion.div>

        </div>

        {/* Stats */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <AnimatedCard
                key={item.label}
                delay={index * 0.08}
                glow
              >
                <div className="rounded-3xl border border-border/50 bg-background/80 p-6 backdrop-blur-lg">

                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>

                  <div className="text-3xl font-extrabold">
                    {item.value}
                  </div>

                  <div className="mt-2 text-sm text-muted-foreground">
                    {item.label}
                  </div>

                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}