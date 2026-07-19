"use client";

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

const FEATURES: Feature[] = [
  {
    title: "Premium Quality",
    description:
      "Every product is sourced from trusted farms and verified suppliers with strict quality control.",
    icon: BadgeCheck,
  },
  {
    title: "Global Export",
    description:
      "Reliable export operations with documentation, logistics and worldwide shipping support.",
    icon: Globe2,
  },
  {
    title: "Sustainable Farming",
    description:
      "Supporting environmentally responsible farming practices and ethical sourcing.",
    icon: Leaf,
  },
  {
    title: "Certified Products",
    description:
      "Products backed by applicable certifications and export compliance standards.",
    icon: ShieldCheck,
  },
  {
    title: "Efficient Logistics",
    description:
      "Optimized supply chain from farm to destination with complete shipment visibility.",
    icon: Truck,
  },
  {
    title: "Dedicated Support",
    description:
      "Professional assistance for importers, distributors and wholesale buyers.",
    icon: Users,
  },
];

export default function PremiumFeatures() {
  return (
    <Section spacing="xl">
      <Container size="2xl">
        <SectionHeader
          eyebrow="Why ROOTYM"
          title="Why Global Buyers Choose ROOTYM"
          description="Built for international trade with transparency, quality assurance and dependable export operations."
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