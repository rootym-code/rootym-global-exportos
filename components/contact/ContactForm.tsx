/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : Contact
 * Feature     : Contact / Inquiry Form
 * Purpose     : Provides the public inquiry form for buyers
 *               to submit business and product requirements.
 * ============================================================
 */

"use client";

import { useMemo, useState } from "react";

import { motion, type Variants } from "framer-motion";

import {
  Building2,
  CheckCircle2,
  Globe2,
  Loader2,
  Mail,
  MessageSquare,
  Package,
  Phone,
  Ruler,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";

import type { InquiryInput } from "@/lib/validations/inquiry";

import { useTranslation } from "@/lib/i18n/context";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
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
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const benefits = [
  "contact.form.benefits.consultation",
  "contact.form.benefits.bulkOrders",
  "contact.form.benefits.privateLabel",
  "contact.form.benefits.sourcing",
];

const productOptions = [
  "Makhana (Fox Nuts)",
  "Dehydrated Onion",
  "Potato Products",
  "Rice",
  "Wheat",
  "Other",
];

const unitOptions = [
  "Kg",
  "Metric Ton",
  "Container",
  "Bags",
  "Cartons",
  "Other",
];

const initialForm: InquiryInput = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  country: "",
  product: "",
  quantity: "",
  unit: "",
  message: "",
};

export default function ContactForm() {
  const { t } = useTranslation();

  const [form, setForm] =
    useState<InquiryInput>(initialForm);

  const [submitting, setSubmitting] =
    useState(false);

  const [success, setSuccess] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      form.companyName.trim() &&
      form.contactPerson.trim() &&
      form.email.trim() &&
      form.country.trim() &&
      form.product.trim() &&
      form.message.trim().length >= 10
    );
  }, [form]);

  function updateField<
    K extends keyof InquiryInput,
  >(field: K, value: InquiryInput[K]) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch(
        "/api/inquiry",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ??
            t("contact.form.errors.submit"),
        );
      }

      setSuccess(result.message);

      setForm(initialForm);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("contact.form.errors.submit"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="contact-form"
      className="bg-gradient-to-b from-green-50 to-white py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          className="grid gap-12 lg:grid-cols-2 lg:items-start"
        >
          {/* Left Panel */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
              {t("contact.form.badge")}
            </span>

            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              {t("contact.form.title.line1")}

              <span className="block text-green-700">
                {t("contact.form.title.line2")}
              </span>
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t("contact.form.description")}
            </p>

            <div className="mt-10 space-y-5">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-green-700" />

                  <span className="text-gray-700">
                    {t(benefit)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-green-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-green-700" />

                <h3 className="text-lg font-semibold text-gray-900">
                  {t("contact.form.why.title")}
                </h3>
              </div>

              <ul className="mt-5 space-y-3 text-gray-600">
                <li>
                  • {t("contact.form.why.apeda")}
                </li>

                <li>
                  • {t("contact.form.why.support")}
                </li>

                <li>
                  • {t("contact.form.why.sourcing")}
                </li>

                <li>
                  • {t("contact.form.why.communication")}
                </li>

                <li>
                  • {t("contact.form.why.quality")}
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            variants={itemVariants}
            className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl lg:p-10"
          >
            {success && (
              <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-700" />

                  <div>
                    <h3 className="font-semibold text-green-900">
                      {t("contact.form.success.title")}
                    </h3>

                    <p className="mt-1 text-sm text-green-700">
                      {success}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-700">
                  {error}
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t(
                      "contact.form.fields.contactPerson",
                    )}
                  </label>

                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      required
                      value={form.contactPerson}
                      onChange={(e) =>
                        updateField(
                          "contactPerson",
                          e.target.value,
                        )
                      }
                      placeholder={t(
                        "contact.form.placeholders.contactPerson",
                      )}
                      className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-green-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t(
                      "contact.form.fields.companyName",
                    )}
                  </label>

                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      required
                      value={form.companyName}
                      onChange={(e) =>
                        updateField(
                          "companyName",
                          e.target.value,
                        )
                      }
                      placeholder={t(
                        "contact.form.placeholders.companyName",
                      )}
                      className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-green-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t("contact.form.fields.email")}
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        updateField(
                          "email",
                          e.target.value,
                        )
                      }
                      placeholder={t(
                        "contact.form.placeholders.email",
                      )}
                      className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-green-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t("contact.form.fields.phone")}
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        updateField(
                          "phone",
                          e.target.value,
                        )
                      }
                      placeholder={t(
                        "contact.form.placeholders.phone",
                      )}
                      className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-green-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t("contact.form.fields.country")}
                  </label>

                  <div className="relative">
                    <Globe2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      required
                      value={form.country}
                      onChange={(e) =>
                        updateField(
                          "country",
                          e.target.value,
                        )
                      }
                      placeholder={t(
                        "contact.form.placeholders.country",
                      )}
                      className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-green-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t("contact.form.fields.product")}
                  </label>

                  <div className="relative">
                    <Package className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <select
                      required
                      value={form.product}
                      onChange={(e) =>
                        updateField(
                          "product",
                          e.target.value,
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-green-600"
                    >
                      <option value="">
                        {t(
                          "contact.form.options.selectProduct",
                        )}
                      </option>

                      {productOptions.map(
                        (product) => (
                          <option
                            key={product}
                            value={product}
                          >
                            {product}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t("contact.form.fields.quantity")}
                  </label>

                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <input
                      type="text"
                      value={form.quantity}
                      onChange={(e) =>
                        updateField(
                          "quantity",
                          e.target.value,
                        )
                      }
                      placeholder={t(
                        "contact.form.placeholders.quantity",
                      )}
                      className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-green-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {t("contact.form.fields.unit")}
                  </label>

                  <div className="relative">
                    <Ruler className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                    <select
                      value={form.unit}
                      onChange={(e) =>
                        updateField(
                          "unit",
                          e.target.value,
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-green-600"
                    >
                      <option value="">
                        {t(
                          "contact.form.options.selectUnit",
                        )}
                      </option>

                      {unitOptions.map((unit) => (
                        <option
                          key={unit}
                          value={unit}
                        >
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t(
                    "contact.form.fields.requirement",
                  )}
                </label>

                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-gray-400" />

                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) =>
                      updateField(
                        "message",
                        e.target.value,
                      )
                    }
                    placeholder={t(
                      "contact.form.placeholders.requirement",
                    )}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-green-600"
                  />
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  {t(
                    "contact.form.requirementHint",
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 text-green-700" />

                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {t(
                        "contact.form.security.title",
                      )}
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {t(
                        "contact.form.security.description",
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={
                    submitting || !canSubmit
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-4 font-semibold text-white transition-all duration-300 hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />

                      {t(
                        "contact.form.buttons.submitting",
                      )}
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />

                      {t(
                        "contact.form.buttons.submit",
                      )}
                    </>
                  )}
                </button>

                <p className="text-center text-sm leading-6 text-gray-500">
                  {t(
                    "contact.form.privacyNotice",
                  )}
                </p>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}