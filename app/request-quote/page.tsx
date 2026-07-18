import Navbar from "@/components/layout/Navbar";
import ExportInquiryForm from "@/components/forms/ExportInquiryForm";

export default function RequestQuotePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-32">
        <div className="text-center">
          <span className="rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-[#2E7D32]">
            Export Inquiry
          </span>

          <h1 className="mt-6 text-5xl font-bold text-gray-900">
            Request an Export Quote
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Complete the inquiry below and our export team will prepare a
            customized quotation based on your product requirements,
            destination, and packaging preferences.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <ExportInquiryForm />
        </div>
      </section>
    </main>
  );
}