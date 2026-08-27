/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : Layout
 * Feature     : Public Footer
 * Purpose     : Displays CMS-managed company information,
 *               contact details and social media links.
 * ============================================================
 */

"use client";

import { useTranslation } from "@/lib/i18n/context";
import { Link } from "@/lib/i18n/Link";
import { motion, type Variants } from "framer-motion";

import { useCompanySettings } from "@/lib/cms/company-settings";

import {
  Mail,
  MapPin,
  Phone,
  MessageCircle,
} from "lucide-react";

import {
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

/* ============================================================
   Animation Variants
============================================================ */

const sectionVariants: Variants = {
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
      when: "beforeChildren",
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
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

/* ============================================================
   Footer
============================================================ */

export default function Footer() {
  const { t } = useTranslation();

  /*
   * All client-specific company information is loaded from
   * the centralized CMS company settings hook.
   */
  const {
    companyName,
    legalName,
    tagline,
    logo,
    address,
    phone,
    whatsapp,
    email,
    social,
  } = useCompanySettings();

  /* ============================================================
     Resolved CMS Values
  ============================================================ */

  const resolvedCompanyName =
    companyName?.trim() || "Company";

  const resolvedLegalName =
    legalName?.trim() || resolvedCompanyName;

  const resolvedTagline =
    tagline?.trim() || "";

  const resolvedDescription = t(
    "footer.company.description"
  ).replace(/^ROOTYM\b/, resolvedCompanyName);

  const resolvedAddress =
    address?.trim() || "";

  const resolvedEmail =
    email?.trim() || "";

  const resolvedPhone =
    phone?.trim() || "";

  const resolvedWhatsapp =
    whatsapp?.trim() || "";

  const resolvedLogo =
    logo?.trim() || "";

  /* ============================================================
     Social Links
  ============================================================ */

  const socialLinks = [
    {
      Icon: FaLinkedin,
      label: "LinkedIn",
      url: social?.linkedin?.trim() || "",
    },
    {
      Icon: FaFacebook,
      label: "Facebook",
      url: social?.facebook?.trim() || "",
    },
    {
      Icon: FaInstagram,
      label: "Instagram",
      url: social?.instagram?.trim() || "",
    },
    {
      Icon: FaYoutube,
      label: "YouTube",
      url: social?.youtube?.trim() || "",
    },
  ].filter((item) => item.url);

  /* ============================================================
     Contact URLs
  ============================================================ */

  const phoneHref = resolvedPhone
    ? `tel:${resolvedPhone.replace(/[^\d+]/g, "")}`
    : "";

  const whatsappHref = resolvedWhatsapp
    ? `https://wa.me/${resolvedWhatsapp.replace(/\D/g, "")}`
    : "";

  return (
    <motion.footer
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.15,
      }}
      className="relative overflow-hidden bg-[#143D1F] text-white"
    >
      {/* ============================================================
          Ambient Background
      ============================================================ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -50, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-green-400/10 blur-[140px]"
        />

        <motion.div
          animate={{
            x: [0, -70, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-green-300/10 blur-[120px]"
        />
      </div>

      {/* ============================================================
          Main Footer Content
      ============================================================ */}

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">

          {/* ========================================================
              Company
          ======================================================== */}

          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >
            {resolvedLogo ? (
              <div className="mb-5">
                <img
                  src={resolvedLogo}
                  alt={resolvedCompanyName}
                  className="h-12 w-auto max-w-[220px] object-contain object-left"
                />
              </div>
            ) : (
              <motion.h2
                whileHover={{
                  scale: 1.02,
                }}
                className="text-3xl font-bold"
              >
                {resolvedCompanyName}
              </motion.h2>
            )}

            {resolvedTagline && (
              <p className="mt-3 font-medium text-green-300">
                {resolvedTagline}
              </p>
            )}

            <p className="mt-6 max-w-md leading-8 text-green-100">
              {resolvedDescription}
            </p>
          </motion.div>

          {/* ========================================================
              Quick Links
          ======================================================== */}

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold">
              {t("footer.headings.quickLinks")}
            </h3>

            <ul className="mt-6 space-y-3">
              {[
                {
                  label: t("footer.links.home"),
                  href: "/",
                },
                {
                  label: t("footer.links.products"),
                  href: "/products",
                },
                {
                  label: t("footer.links.about"),
                  href: "/about",
                },
                {
                  label: t("footer.links.contact"),
                  href: "/contact",
                },
              ].map((item) => (
                <li key={item.href}>
                  <motion.div
                    whileHover={{
                      x: 6,
                    }}
                  >
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-green-300"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ========================================================
              Products
          ======================================================== */}

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold">
              {t("footer.headings.products")}
            </h3>

            <ul className="mt-6 space-y-3">
              {[
                {
                  label: t("footer.products.makhana"),
                  href: "/products/makhana",
                },
                {
                  label: t("footer.products.onion"),
                  href: "/products/onion",
                },
                {
                  label: t("footer.products.potato"),
                  href: "/products/potato",
                },
                {
                  label: t("footer.products.mango"),
                  href: "/products/mango",
                },
              ].map((item) => (
                <li key={item.href}>
                  <motion.div
                    whileHover={{
                      x: 6,
                    }}
                  >
                    <Link
                      href={item.href}
                      className="text-green-100 transition-colors hover:text-green-300"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ========================================================
              Contact
          ======================================================== */}

          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold">
              {t("footer.headings.contact")}
            </h3>

            <div className="mt-6 space-y-5">

              {/* Address */}

              {resolvedAddress && (
                <motion.div
                  whileHover={{
                    x: 5,
                  }}
                  className="flex gap-3"
                >
                  <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-green-300" />

                  <span className="text-green-100">
                    {resolvedAddress}
                  </span>
                </motion.div>
              )}

              {/* Email */}

              {resolvedEmail && (
                <motion.div
                  whileHover={{
                    x: 5,
                  }}
                  className="flex gap-3"
                >
                  <Mail className="mt-1 h-5 w-5 flex-shrink-0 text-green-300" />

                  <a
                    href={`mailto:${resolvedEmail}`}
                    className="text-green-100 transition-colors hover:text-green-300"
                  >
                    {resolvedEmail}
                  </a>
                </motion.div>
              )}

              {/* Phone */}

              {resolvedPhone && (
                <motion.div
                  whileHover={{
                    x: 5,
                  }}
                  className="flex gap-3"
                >
                  <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-green-300" />

                  <a
                    href={phoneHref}
                    className="text-green-100 transition-colors hover:text-green-300"
                  >
                    {resolvedPhone}
                  </a>
                </motion.div>
              )}

              {/* WhatsApp */}

              {resolvedWhatsapp && whatsappHref && (
                <motion.div
                  whileHover={{
                    x: 5,
                  }}
                  className="flex gap-3"
                >
                  <MessageCircle className="mt-1 h-5 w-5 flex-shrink-0 text-green-300" />

                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-100 transition-colors hover:text-green-300"
                  >
                    WhatsApp
                  </a>
                </motion.div>
              )}
            </div>

            {/* ======================================================
                Social Icons
            ====================================================== */}

            {socialLinks.length > 0 && (
              <div className="mt-8 flex gap-4">
                {socialLinks.map(
                  ({
                    Icon,
                    label,
                    url,
                  }) => (
                    <motion.a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      whileHover={{
                        y: -5,
                        scale: 1.15,
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-green-500/40 bg-white/5 text-green-200 backdrop-blur transition-colors hover:border-green-300 hover:bg-white/10 hover:text-white"
                    >
                      <Icon className="h-5 w-5" />
                    </motion.a>
                  )
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* ============================================================
            Bottom Bar
        ============================================================ */}

        <motion.div
          variants={itemVariants}
          className="mt-16 border-t border-green-700/70 pt-8 text-center"
        >
          <p className="text-sm text-green-200">
            © {new Date().getFullYear()} {resolvedLegalName}. All Rights Reserved.
          </p>

          <p className="mt-2 text-xs text-green-300">
            {t("footer.tagline")}
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}