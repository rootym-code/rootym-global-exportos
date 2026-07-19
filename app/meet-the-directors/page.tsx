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

export const metadata: Metadata = {
  title: "Meet The Directors | ROOTYM Agro Harvest Private Limited",
  description:
    "Meet the leadership team behind ROOTYM Agro Harvest Private Limited. Discover our vision, values, experience, and commitment to delivering premium Indian agricultural products worldwide.",
};

export default function MeetTheDirectorsPage() {
  return (
    <>
      <Navbar />

      <main className="overflow-hidden">
        <DirectorsHero />

        <DirectorsIntroduction />

        <DirectorProfile
          name="Prem Chand Singh"
          designation="Director"
          image="/images/directors/prem-singh.webp"
          location="Pune, Maharashtra, India"
          email="director@rootym.com"
          biography={[
            "Prem Chand Singh brings more than two decades of professional experience across technology, business leadership and strategic execution. His passion for agriculture and global trade inspired the creation of ROOTYM with a vision of connecting India's agricultural excellence to international markets.",
            "His leadership focuses on building transparent business relationships, adopting technology-driven solutions and delivering premium-quality agricultural products that meet global expectations.",
          ]}
          vision="Our goal is to build a globally trusted agricultural export company that creates lasting value for customers while empowering Indian farmers through sustainable growth."
          expertise={[
            "Business Strategy",
            "Technology Leadership",
            "Export Management",
            "International Business",
            "Operations",
          ]}
          achievements={[
            "20+ years of professional leadership experience",
            "Co-founded ROOTYM Agro Harvest Private Limited",
            "Driving international export expansion",
            "Committed to innovation and sustainable growth",
          ]}
        />

        <DirectorProfile
          reverse
          name="Anjali Singh"
          designation="Director"
          image="/images/directors/anjali-singh.webp"
          location="Pune, Maharashtra, India"
          email="director@rootym.com"
          biography={[
            "Anjali Singh plays a key role in strengthening ROOTYM's organizational foundation through operational excellence, customer relationships and strategic planning.",
            "She believes that sustainable business growth comes from strong ethics, consistent quality and building long-term partnerships with customers across global markets.",
          ]}
          vision="Strong businesses are built on trust, quality, collaboration and a genuine commitment to customer success."
          expertise={[
            "Business Operations",
            "Customer Relations",
            "Strategic Planning",
            "Administration",
            "Business Development",
          ]}
          achievements={[
            "Co-founded ROOTYM Agro Harvest Private Limited",
            "Driving organizational excellence",
            "Supporting global business partnerships",
            "Focused on long-term sustainable growth",
          ]}
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