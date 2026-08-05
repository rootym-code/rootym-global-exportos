import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ServicesContent from "@/components/services/ServicesContent";

export const metadata = {
  title: "Export Services | ROOTYM Global Export Platform",
  description:
    "End-to-end agricultural export services from India including sourcing, quality assurance, export documentation, packaging and international logistics.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      <ServicesContent />

      <Footer />
    </>
  );
}

