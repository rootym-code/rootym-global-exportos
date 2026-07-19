"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Award,
  Globe,
  Mail,
  MapPin,
  Quote,
} from "lucide-react";

export interface DirectorProfileProps {
  name: string;
  designation: string;
  image: string;
  location: string;
  email: string;
  biography: string[];
  vision: string;
  expertise: string[];
  achievements: string[];
  reverse?: boolean;
}

const containerVariants: Variants = {
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

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

export default function DirectorProfile({
  name,
  designation,
  image,
  location,
  email,
  biography,
  vision,
  expertise,
  achievements,
  reverse = false,
}: DirectorProfileProps) {
  return (
    <section className="py-20 lg:py-28">
      <motion.div
        className={`mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* Photo */}
        <motion.div variants={itemVariants}>
          <div className="relative overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-6 shadow-xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
                priority={false}
              />
            </div>

            <div className="mt-6 rounded-2xl bg-green-900 p-6 text-white">
              <h3 className="text-xl font-bold">{name}</h3>

              <p className="mt-1 text-green-200">{designation}</p>

              <div className="mt-5 space-y-3 text-sm text-green-100">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4" />
                  {location}
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4" />
                  <Link
                    href={`mailto:${email}`}
                    className="transition hover:text-white"
                  >
                    {email}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants}>
          <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
            Leadership Profile
          </span>

          <h2 className="mt-6 text-4xl font-bold text-gray-900">
            {name}
          </h2>

          <p className="mt-2 text-xl font-medium text-green-700">
            {designation}
          </p>

          <div className="mt-8 space-y-6">
            {biography.map((paragraph, index) => (
              <p
                key={index}
                className="leading-8 text-gray-600"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Vision */}
          <div className="mt-10 rounded-3xl border border-green-200 bg-gradient-to-r from-green-50 to-white p-8">
            <Quote className="mb-4 h-8 w-8 text-green-700" />

            <p className="text-lg italic leading-8 text-gray-700">
              {vision}
            </p>
          </div>

          {/* Expertise */}
          <div className="mt-10">
            <div className="mb-5 flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-700" />

              <h3 className="text-xl font-bold text-gray-900">
                Core Expertise
              </h3>
            </div>

            <div className="flex flex-wrap gap-3">
              {expertise.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="mt-10">
            <div className="mb-5 flex items-center gap-2">
              <Award className="h-5 w-5 text-green-700" />

              <h3 className="text-xl font-bold text-gray-900">
                Leadership Highlights
              </h3>
            </div>

            <div className="space-y-4">
              {achievements.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3"
                >
                  <div className="mt-2 h-2 w-2 rounded-full bg-green-600" />

                  <p className="text-gray-600">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-green-800"
            >
              Connect With ROOTYM
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}