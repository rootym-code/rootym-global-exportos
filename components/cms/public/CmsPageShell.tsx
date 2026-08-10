import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type CmsPageShellProps = {
  layout: "WEBSITE" | "STANDALONE";
  children: React.ReactNode;
};

export default function CmsPageShell({
  layout,
  children,
}: CmsPageShellProps) {
  if (layout === "STANDALONE") {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />

      {children}

      <Footer />
    </>
  );
}