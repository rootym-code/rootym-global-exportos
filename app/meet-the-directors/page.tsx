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
    "Meet the founders and directors of ROOTYM Agro Harvest Private Limited. Learn about our leadership, vision, agricultural expertise, global export mission, and commitment to quality, sustainability, and empowering Indian farmers.",
  keywords: [
    "ROOTYM Directors",
    "Prem Chand Singh",
    "Anjali Singh",
    "ROOTYM Leadership",
    "Agricultural Export Company",
    "Indian Exporters",
    "Global Food Export",
    "Agricultural Leadership",
    "ROOTYM Agro Harvest",
  ],
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
          designation="Founder & Director"
          image="/images/directors/prem-singh.webp"
          location="Pune, Maharashtra, India"
          email="director@rootym.com"
          biography={[
            "Prem Chand Singh is the Founder and Director of ROOTYM Agro Harvest Private Limited. With over two decades of leadership experience in technology, enterprise transformation, and strategic business management, he envisioned ROOTYM as a bridge connecting India's agricultural excellence with global markets.",
            "After a successful corporate career, he dedicated himself to building a modern export enterprise focused on quality, transparency, innovation, and long-term partnerships. His leadership combines technology-driven processes with ethical sourcing and international quality standards to deliver premium agricultural products worldwide.",
            "He strongly believes that sustainable exports begin with empowering farmers, improving supply chains, and creating value for customers through consistency, trust, and continuous innovation.",
          ]}
          vision="To establish ROOTYM as one of India's most trusted global agricultural export brands by delivering premium products, embracing innovation, empowering farmers, and building lasting international partnerships."
          expertise={[
            "Business Strategy",
            "Technology Leadership",
            "Global Export Management",
            "International Business Development",
            "Supply Chain & Operations",
            "Digital Transformation",
          ]}
          achievements={[
            "20+ years of leadership and technology experience",
            "Founder & Director of ROOTYM Agro Harvest Private Limited",
            "Leading ROOTYM's global expansion strategy",
            "Building technology-enabled export operations",
            "Promoting sustainable agricultural growth and farmer empowerment",
          ]}
        />

        <DirectorProfile
          reverse
          name="Anjali Singh"
          designation="Co-Founder & Director"
          image="/images/directors/anjali-singh.webp"
          location="Pune, Maharashtra, India"
          email="director@rootym.com"
          biography={[
            "Anjali Singh serves as the Co-Founder and Director of ROOTYM Agro Harvest Private Limited. She plays a pivotal role in strengthening the company's operational excellence, organizational development, customer engagement, and strategic planning.",
            "Her leadership philosophy is centered around trust, integrity, quality assurance, and creating meaningful relationships with customers and business partners across international markets.",
            "She continuously works toward building efficient business processes that enable sustainable growth while ensuring ROOTYM consistently delivers exceptional service and premium-quality agricultural products.",
          ]}
          vision="To create a globally respected organization built on integrity, operational excellence, customer satisfaction, and sustainable business practices that benefit every stakeholder."
          expertise={[
            "Business Operations",
            "Strategic Planning",
            "Customer Relationship Management",
            "Administration",
            "Business Development",
            "Organizational Excellence",
          ]}
          achievements={[
            "Co-Founder & Director of ROOTYM Agro Harvest Private Limited",
            "Driving operational excellence across the organization",
            "Strengthening international customer relationships",
            "Supporting sustainable and ethical business growth",
            "Building long-term strategic partnerships",
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