/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : Meet The Directors
 * Feature     : Directors Page
 * Purpose     : Displays company leadership information using
 *               CMS-managed company identity and
 *               locale-aware translations.
 * ============================================================
 */

import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
  CompanyValues,
  DirectorProfile,
  DirectorsHero,
  DirectorsIntroduction,
  LeadershipCTA,
  LeadershipPhilosophy,
  LeadershipTimeline,
} from "@/components/directors";

import siteSettingService from "@/lib/services/cms/site-setting.service";

import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const settings =
    await siteSettingService.getCompanySettings();

  const companyName =
    settings.company.companyName.trim() || "ROOTYM";

  const legalName =
    settings.company.legalName.trim() || companyName;

  return {
    title: `Meet The Directors | ${legalName}`,

    description:
      `Meet the founders and directors of ${legalName}. Learn about our leadership, vision, agricultural expertise, global export mission, and commitment to quality, sustainability, and empowering Indian farmers.`,

    keywords: [
      `${companyName} Directors`,
      "Prem Chand Singh",
      "Anjali Singh",
      `${companyName} Leadership`,
      "Agricultural Export Company",
      "Indian Exporters",
      "Global Food Export",
      "Agricultural Leadership",
      `${companyName} Agro Harvest`,
    ],
  };
}

interface MeetTheDirectorsPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function MeetTheDirectorsPage({
  params,
}: MeetTheDirectorsPageProps) {
  const { locale } = await params;

  const dictionary = await getDictionary(locale);

  const settings =
    await siteSettingService.getCompanySettings();

  const companyName =
    settings.company.companyName.trim() || "ROOTYM";

  const getTranslation = (
    key: string
  ): string => {
    const keys = key.split(".");
    let value: any = dictionary;

    for (const part of keys) {
      if (
        value &&
        typeof value === "object" &&
        part in value
      ) {
        value = value[part];
      } else {
        return key;
      }
    }

    return typeof value === "string"
      ? value
      : key;
  };

  const getArrayTranslation = (
    key: string
  ): string[] => {
    const keys = key.split(".");
    let value: any = dictionary;

    for (const part of keys) {
      if (
        value &&
        typeof value === "object" &&
        part in value
      ) {
        value = value[part];
      } else {
        return [];
      }
    }

    return Array.isArray(value)
      ? value.filter(
          (item): item is string =>
            typeof item === "string"
        )
      : [];
  };

  const resolvedCompanyName =
    companyName || "ROOTYM";

  const premBiography =
    getArrayTranslation(
      "about.directorProfiles.prem.biography"
    );

  const premExpertise =
    getArrayTranslation(
      "about.directorProfiles.prem.expertise"
    );

  const premAchievements =
    getArrayTranslation(
      "about.directorProfiles.prem.achievements"
    );

  const anjaliBiography =
    getArrayTranslation(
      "about.directorProfiles.anjali.biography"
    );

  const anjaliExpertise =
    getArrayTranslation(
      "about.directorProfiles.anjali.expertise"
    );

  const anjaliAchievements =
    getArrayTranslation(
      "about.directorProfiles.anjali.achievements"
    );

  return (
    <>
      <Navbar />

      <main className="overflow-hidden">
        <DirectorsHero />

        <DirectorsIntroduction />

        <DirectorProfile
          name={getTranslation(
            "about.directorProfiles.prem.name"
          )}
          designation={getTranslation(
            "about.directorProfiles.prem.designation"
          )}
          image="/images/directors/prem-singh.webp"
          location={getTranslation(
            "about.directorProfiles.prem.location"
          )}
          email={getTranslation(
            "about.directorProfiles.prem.email"
          )}
          biography={premBiography}
          vision={getTranslation(
            "about.directorProfiles.prem.vision"
          )}
          expertise={premExpertise}
          achievements={premAchievements}
        />

        <DirectorProfile
          reverse
          name={getTranslation(
            "about.directorProfiles.anjali.name"
          )}
          designation={getTranslation(
            "about.directorProfiles.anjali.designation"
          )}
          image="/images/directors/anjali-singh.webp"
          location={getTranslation(
            "about.directorProfiles.anjali.location"
          )}
          email={getTranslation(
            "about.directorProfiles.anjali.email"
          )}
          biography={anjaliBiography}
          vision={getTranslation(
            "about.directorProfiles.anjali.vision"
          )}
          expertise={anjaliExpertise}
          achievements={anjaliAchievements}
        />

        <LeadershipPhilosophy />

        <CompanyValues />

        <LeadershipTimeline />

        <LeadershipCTA />
      </main>

      <Footer />
    </>
  );
}