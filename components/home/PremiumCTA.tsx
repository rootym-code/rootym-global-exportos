"use client";
import { useTranslation } from "@/lib/i18n/context";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/ui/container";
import Section from "@/components/ui/section";
import PremiumButton from "@/components/ui/premium-button";

export default function PremiumCTA() {
  const { t } = useTranslation();
  return (
    <Section
      spacing="xl"
      className="relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-600" />
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      </div>

      <Container size="xl">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
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
            duration: 0.5,
          }}
          className="relative z-10 text-center"
        >
          <div className="mx-auto max-w-4xl">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-6xl">
  {t("cta.title.line1")}
  <span className="block">
    {t("cta.title.line2")}
  </span>
</h2>

<p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-white/90">
  {t("cta.description")}
</p>

           
           
            <div className="mt-10 flex flex-wrap justify-center gap-4">
  <PremiumButton
    size="xl"
    variant="gradient"
    rightIcon={<ArrowRight className="h-5 w-5" />}
  >
{t("cta.buttons.quote")}
  </PremiumButton>

  <PremiumButton
    size="xl"
    variant="outline"
    className="border-2 border-white !text-white hover:bg-white/10"
  >
 {t("cta.buttons.products")}
  </PremiumButton>
</div>




            <div className="mt-12 flex flex-wrap justify-center gap-10 text-white">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5" />
                <span>export@rootym.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5" />
                <span>+91 98735 29752</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}