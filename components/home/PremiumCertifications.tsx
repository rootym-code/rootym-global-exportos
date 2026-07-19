"use client";

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

const CERTIFICATIONS: Certification[] = [
  {
    title: "APEDA Registered",
    description:
      "Recognized exporter registered with the Agricultural and Processed Food Products Export Development Authority.",
    icon: Globe2,
  },
  {
    title: "FSSAI Certified",
    description:
      "Food products processed and handled in compliance with Indian food safety standards.",
    icon: ShieldCheck,
  },
  {
    title: "IEC Holder",
    description:
      "Valid Import Export Code enabling international trade and global shipments.",
    icon: FileCheck2,
  },
  {
    title: "MSME Registered",
    description:
      "Registered Indian MSME committed to quality manufacturing and export excellence.",
    icon: BadgeCheck,
  },
  {
    title: "Quality Assurance",
    description:
      "Every shipment passes quality inspection before dispatch to international buyers.",
    icon: Award,
  },
  {
    title: "Trusted Worldwide",
    description:
      "Building long-term relationships with importers through transparency and reliability.",
    icon: Star,
  },
];

export default function PremiumCertifications() {
  return (
    <Section spacing="xl">
      <Container size="2xl">
        <SectionHeader
          eyebrow="Trust & Compliance"
          title="Certified for International Trade"
          description="ROOTYM follows internationally accepted export practices backed by registrations, compliance and rigorous quality assurance."
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