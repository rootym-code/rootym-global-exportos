import Navbar from "@/components/layout/Navbar";

export default function RequestQuotePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pt-32 pb-20">
        {/* Header */}

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
            destination and packaging preferences.
          </p>
        </div>

        {/* Progress */}

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-[#2E7D32]">
              Step 1 of 7
            </span>

            <span className="text-gray-500">
              Product Selection
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-[14%] rounded-full bg-[#2E7D32]" />
          </div>
        </div>

        {/* Wizard Container */}

        <div className="mx-auto mt-14 max-w-4xl rounded-3xl bg-white p-10 shadow-xl">

          <h2 className="text-3xl font-bold text-gray-900">
            Select Product
          </h2>

          <p className="mt-4 text-gray-600">
            In the next sprint this area will become the multi-step inquiry
            wizard.
          </p>

          <div className="mt-16 flex justify-between">
            <button
              disabled
              className="rounded-xl border border-gray-300 px-8 py-3 text-gray-400"
            >
              Previous
            </button>

            <button className="rounded-xl bg-[#2E7D32] px-8 py-3 font-semibold text-white transition hover:bg-[#256428]">
              Next
            </button>
          </div>

        </div>
      </section>
    </main>
  );
}