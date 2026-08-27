import type { Metadata } from "next";
import {
  ArrowRight,
  Globe2,
  MapPin,
  PackageCheck,
  Ship,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import Link from "@/lib/i18n/Link";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

import siteSettingService from "@/lib/services/cms/site-setting.service";

export async function generateMetadata(): Promise<Metadata> {
  const settings =
    await siteSettingService.getCompanySettings();

  const companyName =
    settings.company.companyName.trim() || "ROOTYM";

  const legalName =
    settings.company.legalName.trim() || companyName;

  return {
    title: `Global Markets | ${legalName}`,
    description:
      `${companyName} connects global buyers with premium Indian agricultural products through reliable sourcing, export compliance, quality assurance and international logistics support.`,
    keywords: [
      `${companyName} Global Markets`,
      "Indian Agricultural Exporter",
      "Agricultural Export Company India",
      "Food Export Partner",
      "Indian Food Export",
      "Global Agricultural Supply Chain",
    ],
  };
}

export default async function MarketsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const dictionary = await getDictionary(locale as Locale);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = dictionary;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <>
      <Navbar />

      <main className="overflow-x-hidden bg-white">
        {/* -------------------------------------------------------------------------- */}
        {/* Hero Section */}
        {/* -------------------------------------------------------------------------- */}

        <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#F5FBF5] to-white py-28">
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-green-200/40 blur-3xl" />

            <div className="absolute right-0 top-32 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-5 py-2 text-sm font-semibold text-[#2E7D32] shadow-sm">
              <Globe2 className="h-4 w-4" />
              {t("marketsPage.hero.badge")}
            </div>

            <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-bold tracking-tight text-gray-900 md:text-7xl">
              {t("marketsPage.hero.title.line1")}
              <span className="block bg-gradient-to-r from-[#2E7D32] via-green-600 to-emerald-500 bg-clip-text text-transparent">
                {t("marketsPage.hero.title.line2")}
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">
              {t("marketsPage.hero.description")}
            </p>

            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/request-quote">
                <Button className="px-8 py-3">
                  {t("marketsPage.hero.buttons.quote")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href="/contact">
                <Button variant="secondary" className="px-8 py-3">
                  {t("marketsPage.hero.buttons.contact")}
                </Button>
              </Link>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-4">
              <MarketHighlight
                icon={<ShieldCheck />}
                title={t(
                  "marketsPage.hero.highlights.compliance.title"
                )}
                description={t(
                  "marketsPage.hero.highlights.compliance.description"
                )}
              />

              <MarketHighlight
                icon={<PackageCheck />}
                title={t(
                  "marketsPage.hero.highlights.quality.title"
                )}
                description={t(
                  "marketsPage.hero.highlights.quality.description"
                )}
              />

              <MarketHighlight
                icon={<Ship />}
                title={t(
                  "marketsPage.hero.highlights.logistics.title"
                )}
                description={t(
                  "marketsPage.hero.highlights.logistics.description"
                )}
              />

              <MarketHighlight
                icon={<TrendingUp />}
                title={t(
                  "marketsPage.hero.highlights.supply.title"
                )}
                description={t(
                  "marketsPage.hero.highlights.supply.description"
                )}
              />
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* Global Markets Section */}
        {/* -------------------------------------------------------------------------- */}

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-[#2E7D32]">
                <MapPin className="h-4 w-4" />
                {t("marketsPage.regions.badge")}
              </span>

              <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                {t("marketsPage.regions.title.line1")}
                <span className="block text-[#2E7D32]">
                  {t("marketsPage.regions.title.line2")}
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                {t("marketsPage.regions.description")}
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <RegionCard
                title={t(
                  "marketsPage.regions.cards.middleEast.title"
                )}
                countries={t(
                  "marketsPage.regions.cards.middleEast.countries"
                )}
                description={t(
                  "marketsPage.regions.cards.middleEast.description"
                )}
              />

              <RegionCard
                title={t(
                  "marketsPage.regions.cards.europe.title"
                )}
                countries={t(
                  "marketsPage.regions.cards.europe.countries"
                )}
                description={t(
                  "marketsPage.regions.cards.europe.description"
                )}
              />

              <RegionCard
                title={t("marketsPage.regions.cards.uk.title")}
                countries={t(
                  "marketsPage.regions.cards.uk.countries"
                )}
                description={t(
                  "marketsPage.regions.cards.uk.description"
                )}
              />

              <RegionCard
                title={t(
                  "marketsPage.regions.cards.northAmerica.title"
                )}
                countries={t(
                  "marketsPage.regions.cards.northAmerica.countries"
                )}
                description={t(
                  "marketsPage.regions.cards.northAmerica.description"
                )}
              />

              <RegionCard
                title={t(
                  "marketsPage.regions.cards.southeastAsia.title"
                )}
                countries={t(
                  "marketsPage.regions.cards.southeastAsia.countries"
                )}
                description={t(
                  "marketsPage.regions.cards.southeastAsia.description"
                )}
              />

              <RegionCard
                title={t(
                  "marketsPage.regions.cards.africa.title"
                )}
                countries={t(
                  "marketsPage.regions.cards.africa.countries"
                )}
                description={t(
                  "marketsPage.regions.cards.africa.description"
                )}
              />
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* Why India Section */}
        {/* -------------------------------------------------------------------------- */}

        <section className="bg-[#F8FBF8] py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-[#2E7D32]">
                  {t("marketsPage.indiaAdvantage.badge")}
                </span>

                <h2 className="mt-6 text-4xl font-bold text-gray-900 md:text-5xl">
                  {t("marketsPage.indiaAdvantage.title.line1")}
                  <span className="block text-[#2E7D32]">
                    {t("marketsPage.indiaAdvantage.title.line2")}
                  </span>
                </h2>

                <p className="mt-6 text-lg leading-8 text-gray-600">
                  {t("marketsPage.indiaAdvantage.description")}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <AdvantageCard
                  title={t(
                    "marketsPage.indiaAdvantage.cards.diversity.title"
                  )}
                  description={t(
                    "marketsPage.indiaAdvantage.cards.diversity.description"
                  )}
                />

                <AdvantageCard
                  title={t(
                    "marketsPage.indiaAdvantage.cards.supply.title"
                  )}
                  description={t(
                    "marketsPage.indiaAdvantage.cards.supply.description"
                  )}
                />

                <AdvantageCard
                  title={t(
                    "marketsPage.indiaAdvantage.cards.readiness.title"
                  )}
                  description={t(
                    "marketsPage.indiaAdvantage.cards.readiness.description"
                  )}
                />

                <AdvantageCard
                  title={t(
                    "marketsPage.indiaAdvantage.cards.quality.title"
                  )}
                  description={t(
                    "marketsPage.indiaAdvantage.cards.quality.description"
                  )}
                />
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* Export Capability Section */}
        {/* -------------------------------------------------------------------------- */}

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-[#2E7D32]">
                <Sparkles className="h-4 w-4" />
                {t("marketsPage.capabilities.badge")}
              </span>

              <h2 className="mt-6 text-4xl font-bold text-gray-900 md:text-5xl">
                {t("marketsPage.capabilities.title.line1")}
                <span className="block text-[#2E7D32]">
                  {t("marketsPage.capabilities.title.line2")}
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                {t("marketsPage.capabilities.description")}
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <CapabilityCard
                title={t(
                  "marketsPage.capabilities.cards.bulk.title"
                )}
                description={t(
                  "marketsPage.capabilities.cards.bulk.description"
                )}
              />

              <CapabilityCard
                title={t(
                  "marketsPage.capabilities.cards.packaging.title"
                )}
                description={t(
                  "marketsPage.capabilities.cards.packaging.description"
                )}
              />

              <CapabilityCard
                title={t(
                  "marketsPage.capabilities.cards.quality.title"
                )}
                description={t(
                  "marketsPage.capabilities.cards.quality.description"
                )}
              />

              <CapabilityCard
                title={t(
                  "marketsPage.capabilities.cards.documentation.title"
                )}
                description={t(
                  "marketsPage.capabilities.cards.documentation.description"
                )}
              />

              <CapabilityCard
                title={t(
                  "marketsPage.capabilities.cards.logistics.title"
                )}
                description={t(
                  "marketsPage.capabilities.cards.logistics.description"
                )}
              />

              <CapabilityCard
                title={t(
                  "marketsPage.capabilities.cards.assistance.title"
                )}
                description={t(
                  "marketsPage.capabilities.cards.assistance.description"
                )}
              />

              <CapabilityCard
                title={t(
                  "marketsPage.capabilities.cards.market.title"
                )}
                description={t(
                  "marketsPage.capabilities.cards.market.description"
                )}
              />

              <CapabilityCard
                title={t(
                  "marketsPage.capabilities.cards.partnership.title"
                )}
                description={t(
                  "marketsPage.capabilities.cards.partnership.description"
                )}
              />
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* Export Journey Section */}
        {/* -------------------------------------------------------------------------- */}

        <section className="bg-gradient-to-br from-green-950 via-green-900 to-emerald-950 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center text-white">
              <span className="rounded-full border border-green-300/30 bg-white/10 px-5 py-2 text-sm font-semibold text-green-100">
                {t("marketsPage.journey.badge")}
              </span>

              <h2 className="mt-8 text-4xl font-bold md:text-5xl">
                {t("marketsPage.journey.title.line1")}
                <span className="block text-green-300">
                  {t("marketsPage.journey.title.line2")}
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-green-100">
                {t("marketsPage.journey.description")}
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
              <JourneyStep
                number="01"
                title={t(
                  "marketsPage.journey.steps.enquiry.title"
                )}
                description={t(
                  "marketsPage.journey.steps.enquiry.description"
                )}
              />

              <JourneyStep
                number="02"
                title={t(
                  "marketsPage.journey.steps.selection.title"
                )}
                description={t(
                  "marketsPage.journey.steps.selection.description"
                )}
              />

              <JourneyStep
                number="03"
                title={t(
                  "marketsPage.journey.steps.approval.title"
                )}
                description={t(
                  "marketsPage.journey.steps.approval.description"
                )}
              />

              <JourneyStep
                number="04"
                title={t(
                  "marketsPage.journey.steps.shipment.title"
                )}
                description={t(
                  "marketsPage.journey.steps.shipment.description"
                )}
              />

              <JourneyStep
                number="05"
                title={t(
                  "marketsPage.journey.steps.delivery.title"
                )}
                description={t(
                  "marketsPage.journey.steps.delivery.description"
                )}
              />
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* ROOTYM CO-CAPTAIN Section */}
        {/* -------------------------------------------------------------------------- */}

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="rounded-3xl bg-gradient-to-r from-[#2E7D32] to-[#43A047] px-8 py-14 text-center shadow-2xl md:px-16">
              <div className="mx-auto max-w-5xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white">
                  <Sparkles className="h-4 w-4" />
                  {t("marketsPage.coCaptain.badge")}
                </div>

                <h2 className="mt-8 text-4xl font-bold text-white md:text-5xl">
                  {t("marketsPage.coCaptain.title.line1")}
                  <span className="block text-green-100">
                    {t("marketsPage.coCaptain.title.line2")}
                  </span>
                </h2>

                <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-green-50">
                  {t("marketsPage.coCaptain.description")}
                </p>

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                  <AIBox
                    title={t(
                      "marketsPage.coCaptain.features.marketAdvisor.title"
                    )}
                    description={t(
                      "marketsPage.coCaptain.features.marketAdvisor.description"
                    )}
                  />

                  <AIBox
                    title={t(
                      "marketsPage.coCaptain.features.productMatching.title"
                    )}
                    description={t(
                      "marketsPage.coCaptain.features.productMatching.description"
                    )}
                  />

                  <AIBox
                    title={t(
                      "marketsPage.coCaptain.features.exportCoCaptain.title"
                    )}
                    description={t(
                      "marketsPage.coCaptain.features.exportCoCaptain.description"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- */}
        {/* Final CTA */}
        {/* -------------------------------------------------------------------------- */}

        <section className="bg-[#F8FBF8] py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="rounded-3xl border border-green-100 bg-white p-10 text-center shadow-xl md:p-16">
              <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
                {t("marketsPage.finalCta.title.line1")}
                <span className="block text-[#2E7D32]">
                  {t("marketsPage.finalCta.title.line2")}
                </span>
              </h2>

              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
                {t("marketsPage.finalCta.description")}
              </p>

              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/request-quote">
                  <Button className="px-8 py-3">
                    {t("marketsPage.finalCta.buttons.enquiry")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="/contact">
                  <Button
                    variant="secondary"
                    className="px-8 py-3"
                  >
                    {t("marketsPage.finalCta.buttons.contact")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Helper Components */
/* -------------------------------------------------------------------------- */

function MarketHighlight({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
      <div className="flex justify-center text-[#2E7D32]">
        {icon}
      </div>

      <h3 className="mt-4 text-center font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 text-center text-sm text-gray-600">
        {description}
      </p>
    </div>
  );
}

function RegionCard({
  title,
  countries,
  description,
}: {
  title: string;
  countries: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <Globe2 className="h-8 w-8 text-[#2E7D32]" />

      <h3 className="mt-6 text-2xl font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 text-sm font-semibold text-[#2E7D32]">
        {countries}
      </p>

      <p className="mt-4 leading-7 text-gray-600">
        {description}
      </p>
    </div>
  );
}

function AdvantageCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
      <h3 className="font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
}

function CapabilityCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 text-gray-600">
        {description}
      </p>
    </div>
  );
}

function JourneyStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-center backdrop-blur-md">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/20 font-bold text-white">
        {number}
      </div>

      <h3 className="mt-5 font-bold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-green-100">
        {description}
      </p>
    </div>
  );
}

function AIBox({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-8 backdrop-blur-md">
      <h3 className="text-xl font-bold text-white">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-green-100">
        {description}
      </p>
    </div>
  );
}