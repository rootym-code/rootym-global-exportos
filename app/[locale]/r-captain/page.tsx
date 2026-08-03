import RCaptain from "@/components/r-captain/RCaptain";

export default function RCaptainPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Meet R-CAPTAIN
          </h1>

          <p className="mt-3 max-w-2xl text-gray-600">
            Your AI Export Intelligence Partner from ROOTYM,
            helping global buyers discover trusted Indian
            agricultural products.
          </p>
        </div>

        <RCaptain />
      </div>
    </main>
  );
}