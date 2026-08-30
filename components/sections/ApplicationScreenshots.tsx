/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Displays ROOTYM AI application screenshots on the
 *          public marketing website.
 * ============================================================
 */

import Image from "next/image";

const screenshots = [
  {
    src: "/images/ai/screenshots/screenshot-01.png",
    alt: "ROOTYM AI application dashboard",
  },
  {
    src: "/images/ai/screenshots/screenshot-02.png",
    alt: "ROOTYM AI application interface",
  },
  {
    src: "/images/ai/screenshots/screenshot-03.png",
    alt: "ROOTYM AI business application",
  },
  {
    src: "/images/ai/screenshots/screenshot-04.png",
    alt: "ROOTYM AI business workspace",
  },
  {
    src: "/images/ai/screenshots/screenshot-05.png",
    alt: "ROOTYM AI platform interface",
  },
  {
    src: "/images/ai/screenshots/screenshot-06.png",
    alt: "ROOTYM AI platform dashboard",
  },
];

export default function ApplicationScreenshots() {
  return (
    <section
      id="products"
      className="bg-slate-950 px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            ROOTYM AI Platform
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Built for modern business.
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-400 sm:text-lg">
            Explore the ROOTYM AI applications and intelligent
            business systems designed to simplify operations,
            automate workflows and accelerate growth.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {screenshots.map((screenshot, index) => (
            <div
              key={screenshot.src}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/20"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-900">
                <Image
                  src={screenshot.src}
                  alt={screenshot.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </div>

              <div className="px-5 py-4">
                <p className="text-sm font-medium text-slate-300">
                  Application {index + 1}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}