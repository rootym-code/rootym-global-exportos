"use client";
import { useTranslation } from "@/lib/i18n/context";
import {
  ClipboardCheck,
  FileCheck2,
  PackageCheck,
  Ship,
} from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import SectionHeader from "@/components/ui/section-header";
import AnimatedCard from "@/components/ui/animated-card";

type ProcessStep = {
  step: string;
  title: string;
  description: string;
  icon: React.ElementType;
};

const PROCESS_ICONS = [
  ClipboardCheck,
  FileCheck2,
  PackageCheck,
  Ship,
];



export default function PremiumExportProcess() {
  const { t } = useTranslation();

  const STEPS: ProcessStep[] = [
    {
      step: "01",
      title: t("exportProcess.steps.step1.title"),
      description: t("exportProcess.steps.step1.description"),
      icon: PROCESS_ICONS[0],
    },
    {
      step: "02",
      title: t("exportProcess.steps.step2.title"),
      description: t("exportProcess.steps.step2.description"),
      icon: PROCESS_ICONS[1],
    },
    {
      step: "03",
      title: t("exportProcess.steps.step3.title"),
      description: t("exportProcess.steps.step3.description"),
      icon: PROCESS_ICONS[2],
    },
    {
      step: "04",
      title: t("exportProcess.steps.step4.title"),
      description: t("exportProcess.steps.step4.description"),
      icon: PROCESS_ICONS[3],
    },
  ];
  
return (
    <Section spacing="xl" background="muted">
      <Container size="2xl">
        <SectionHeader
        eyebrow={t("exportProcess.badge")}
        title={t("exportProcess.title")}
        description={t("exportProcess.description")}
          align="center"
        />

        <div className="relative mt-20">
          {/* Desktop Connector */}
          <div className="absolute left-0 right-0 top-12 hidden border-t border-dashed border-primary/20 lg:block" />

          <div className="grid gap-8 lg:grid-cols-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <AnimatedCard
                  key={step.step}
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
                    className="group relative h-full rounded-3xl border border-border/50 bg-background/90 p-8 backdrop-blur-xl"
                  >
                    <div className="relative z-10">
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>

                        <span className="text-4xl font-black text-primary/15">
                          {step.step}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold">
                        {step.title}
                      </h3>

                      <p className="mt-4 leading-7 text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatedCard>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}