"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const directors = [
  {
    name: "Prem Chand Singh",
    designation: "Founder & Director",
    image: "/images/directors/prem-singh.webp",
    description:
      "With extensive leadership experience in technology and business, Prem founded ROOTYM with the vision of bringing premium Indian agricultural products to international markets while empowering farmers and building trusted global partnerships.",
  },
  {
    name: "Anjali Singh",
    designation: "Co-Founder & Director",
    image: "/images/directors/anjali-singh.webp",
    description:
      "Anjali plays a key role in strategic planning, operations, compliance, and customer relationships, ensuring that ROOTYM delivers exceptional quality and service across every export engagement.",
  },
];

export default function LeadershipPreview() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.08),transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            variants={fadeUpVariants}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
              Leadership
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Meet the People
              <span className="block text-green-700">
                Driving ROOTYM Forward
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Our leadership team combines business experience, technology,
              operational excellence, and a shared commitment to promoting
              India's agricultural strength across global markets.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            {directors.map((director) => (
              <motion.div
                key={director.name}
                variants={fadeUpVariants}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-96 overflow-hidden">
                  <Image
                    src={director.image}
                    alt={director.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                    <h3 className="text-3xl font-bold text-white">
                      {director.name}
                    </h3>

                    <p className="mt-2 text-lg text-green-200">
                      {director.designation}
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <p className="leading-8 text-slate-600">
                    {director.description}
                  </p>


                  <div className="mt-8">
  <Link
    href="/meet-the-directors"
    className="inline-flex items-center gap-2 font-semibold text-green-700 transition hover:text-green-800"
  >
    Read Full Profile
    <ArrowRight className="h-5 w-5" />
  </Link>
</div>


                </div>
              </motion.div>
            ))}
          </div>
                    {/* Bottom CTA */}

                    <motion.div
            variants={fadeUpVariants}
            className="mt-20 overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-r from-green-700 via-green-600 to-green-700 shadow-xl"
          >
            <div className="grid gap-10 p-10 lg:grid-cols-2 lg:items-center lg:p-14">
              <div className="text-white">
                <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                  Leadership Excellence
                </span>

                <h3 className="mt-6 text-4xl font-bold leading-tight">
                  Experienced Leadership with a Global Vision
                </h3>

                <p className="mt-6 text-lg leading-8 text-green-50">
                  ROOTYM is guided by leaders committed to quality,
                  innovation, transparency, and long-term partnerships.
                  Learn more about our journey, experience, and vision for
                  transforming Indian agricultural exports.
                </p>

                <Link
                  href="/meet-the-directors"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-green-700 transition-all duration-300 hover:scale-105"
                >
                  Meet the Directors

                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Leadership
                  </h4>

                  <p className="mt-3 text-green-100">
                    Experienced professionals focused on sustainable growth and
                    global business excellence.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Innovation
                  </h4>

                  <p className="mt-3 text-green-100">
                    Combining technology and agriculture to create smarter
                    export solutions.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Integrity
                  </h4>

                  <p className="mt-3 text-green-100">
                    Building trust through transparency, ethical business
                    practices, and consistent quality.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">
                  <h4 className="text-3xl font-bold text-white">
                    Global Vision
                  </h4>

                  <p className="mt-3 text-green-100">
                    Expanding ROOTYM's presence while creating lasting value
                    for customers, farmers, and partners worldwide.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}