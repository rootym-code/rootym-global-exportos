"use client";
import { useTranslation } from "@/lib/i18n/context";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

import AnimatedCard from "@/components/ui/animated-card";
import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import SectionHeader from "@/components/ui/section-header";

type Testimonial = {
  name: string;
  company: string;
  country: string;
  review: string;
};

const TESTIMONIALS_DATA = [
  {
    key: "testimonial1",
    name: "Ahmed Al Mansoori",
  },
  {
    key: "testimonial2",
    name: "David Thompson",
  },
  {
    key: "testimonial3",
    name: "Nimal Perera",
  },
];

export default function PremiumTestimonials() {
  const { t } = useTranslation();

const TESTIMONIALS: Testimonial[] = TESTIMONIALS_DATA.map((item) => ({
  name: item.name,
  company: t(`testimonials.items.${item.key}.company`),
  country: t(`testimonials.items.${item.key}.country`),
  review: t(`testimonials.items.${item.key}.review`),
}));
  return (
    <Section spacing="xl" background="muted">
      <Container size="2xl">
        <SectionHeader
     eyebrow={t("testimonials.badge")}
     title={t("testimonials.title")}
     description={t("testimonials.description")}
          align="center"
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <AnimatedCard
              key={testimonial.name}
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
                className="group relative h-full overflow-hidden rounded-3xl border border-border/50 bg-background/90 p-8 backdrop-blur-xl"
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
                </div>

                <div className="relative z-10">
                  <Quote className="mb-6 h-10 w-10 text-primary/30" />

                  <div className="mb-6 flex gap-1">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  <p className="leading-8 text-muted-foreground">
                    "{testimonial.review}"
                  </p>

                  <div className="mt-8 border-t border-border/50 pt-6">
                    <h3 className="font-bold">
                      {testimonial.name}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {testimonial.company}
                    </p>

                    <p className="text-sm font-medium text-primary">
                      {testimonial.country}
                    </p>
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