"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  FileText,
} from "lucide-react";

export interface CertificationCardProps {
  title: string;
  issuingAuthority: string;
  certificateNumber?: string;
  issuedDate?: string;
  validUntil?: string;
  description: string;
  logo: string;
  certificateUrl?: string;
  status?: "Active" | "Pending" | "Expired";
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const statusStyles = {
  Active:
    "bg-green-100 text-green-700 border-green-200",
  Pending:
    "bg-amber-100 text-amber-700 border-amber-200",
  Expired:
    "bg-red-100 text-red-700 border-red-200",
};

export default function CertificationCard({
  title,
  issuingAuthority,
  certificateNumber,
  issuedDate,
  validUntil,
  description,
  logo,
  certificateUrl,
  status = "Active",
}: CertificationCardProps) {
  return (
    <motion.article
      variants={cardVariants}
      className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl"
    >
      {/* Header */}

      <div className="border-b border-gray-100 bg-gradient-to-br from-green-50 to-white p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-green-100 bg-white">
            <Image
              src={logo}
              alt={title}
              width={56}
              height={56}
              className="object-contain"
            />
          </div>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
          >
            {status}
          </span>
        </div>

        <h3 className="mt-6 text-2xl font-bold text-gray-900">
          {title}
        </h3>

        <p className="mt-2 text-sm font-medium text-green-700">
          {issuingAuthority}
        </p>
      </div>

      {/* Body */}

      <div className="p-8">
        <p className="leading-7 text-gray-600">
          {description}
        </p>

        <div className="mt-8 space-y-4">
          {certificateNumber && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FileText className="h-4 w-4 text-green-700" />

              <span className="font-medium">
                Certificate No:
              </span>

              <span>{certificateNumber}</span>
            </div>
          )}

          {issuedDate && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-green-700" />

              <span className="font-medium">
                Issued:
              </span>

              <span>{issuedDate}</span>
            </div>
          )}

          {validUntil && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle2 className="h-4 w-4 text-green-700" />

              <span className="font-medium">
                Valid Until:
              </span>

              <span>{validUntil}</span>
            </div>
          )}
        </div>

        {certificateUrl && (
          <div className="mt-8">
            <Link
              href={certificateUrl}
              target="_blank"
              className="inline-flex items-center gap-2 font-semibold text-green-700 transition-colors hover:text-green-800"
            >
              View Certificate
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </motion.article>
  );
}