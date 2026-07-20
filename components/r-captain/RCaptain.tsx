"use client";

import Avatar from "./Avatar";
import RCaptainChat from "./RCaptainChat";

export default function RCaptain() {
  return (
    <section className="flex w-full flex-col items-center gap-6 rounded-3xl border border-green-100 bg-gradient-to-b from-white to-green-50 p-8 shadow-lg">
      <div className="relative">
        <Avatar size={160} />

        <span className="absolute bottom-3 right-3 h-5 w-5 rounded-full border-4 border-white bg-green-500" />
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          R-CAPTAIN
        </h2>

        <p className="mt-2 max-w-lg text-sm leading-6 text-gray-600">
          ROOTYM&apos;s AI Export Intelligence Partner,
          helping global buyers source trusted Indian
          agricultural products.
        </p>

        <p className="mt-2 text-xs font-medium text-green-700">
          ● Online | Export Assistant
        </p>
      </div>

      <div className="w-full max-w-3xl">
        <RCaptainChat />
      </div>

      <p className="text-xs text-gray-500">
        Powered by ROOTYM AI Export Intelligence
      </p>
    </section>
  );
}