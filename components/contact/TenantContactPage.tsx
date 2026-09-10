/**
 * ============================================================
 * ROOTYM Global Export Platform
 * ============================================================
 * Author: Prem Singh
 * Module      : Contact
 * Feature     : Tenant Contact Experience
 * Purpose     : Provides the reusable Contact page experience
 *               for customer Websites using tenant-specific
 *               identity, contact information and products.
 * ============================================================
 */

"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Globe2,
  HelpCircle,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Ruler,
  Send,
  ShieldCheck,
  User,
} from "lucide-react";

import { useTranslation } from "@/lib/i18n/context";
import { Button } from "@/components/ui/Button";
import type { InquiryInput } from "@/lib/validations/inquiry";

export type TenantContactProduct = {
  id: string;
  name: string;
  slug: string;
};

export type TenantContactPageProps = {
  companyName: string;
  products: TenantContactProduct[];
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  quoteHref: string;
  productsHref: string;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  accentColor?: string | null;
};

type FormState = InquiryInput & {
  productId: string;
};

const unitOptions = [
  "Kg",
  "Metric Ton",
  "Container",
  "Bags",
  "Cartons",
  "Other",
];

const initialForm: FormState = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  country: "",
  product: "",
  productId: "",
  quantity: "",
  unit: "",
  message: "",
};

export default function TenantContactPage({
  companyName,
  products,
  address,
  email,
  phone,
  whatsapp,
  quoteHref,
  productsHref,
  primaryColor,
  secondaryColor,
  accentColor,
}: TenantContactPageProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState(0);

  const resolvedPrimary = primaryColor || "#2E7D32";
  const resolvedSecondary = secondaryColor || "#43A047";
  const resolvedAccent = accentColor || "#F1F6F3";

  const replaceCompany = (value: string) =>
    value.replace(/\bROOTYM\b/gi, companyName);

  const text = (key: string) => replaceCompany(t(key));

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === form.productId),
    [form.productId, products],
  );

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateProduct = (productId: string) => {
    const product = products.find((item) => item.id === productId);

    setForm((previous) => ({
      ...previous,
      productId,
      product: product?.name ?? "",
    }));
  };

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSubmitting(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: form.companyName,
          contactPerson: form.contactPerson,
          email: form.email,
          phone: form.phone,
          country: form.country,
          product: selectedProduct?.name || form.product,
          productId: form.productId || undefined,
          quantity: form.quantity,
          unit: form.unit,
          message: form.message,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || text("contact.form.errors.submit"),
        );
      }

      setSuccess(result.message || text("contact.form.success.title"));
      setForm(initialForm);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : text("contact.form.errors.submit"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  const faqKeys = [
    ["quotation.question", "quotation.answer"],
    ["products.question", "products.answer"],
    ["bulkOrders.question", "bulkOrders.answer"],
    ["countries.question", "countries.answer"],
    ["documentation.question", "documentation.answer"],
    ["packaging.question", "packaging.answer"],
  ];

  return (
    <main
      className="overflow-hidden"
      style={
        {
          "--tenant-primary": resolvedPrimary,
          "--tenant-secondary": resolvedSecondary,
          "--tenant-accent": resolvedAccent,
        } as React.CSSProperties
      }
    >
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-950">
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-white/10 px-5 py-2 text-sm font-medium text-green-100 backdrop-blur-md">
            <MessageCircle className="h-4 w-4 text-green-300" />
            {text("contact.hero.badge")}
          </span>

          <h1 className="mx-auto mt-8 max-w-5xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            {text("contact.hero.title.line1")}
            <span className="block bg-gradient-to-r from-green-300 via-emerald-200 to-lime-300 bg-clip-text text-transparent">
              {text("contact.hero.title.line2")}
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-green-100/90 md:text-xl">
            {text("contact.hero.description")}
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={quoteHref}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-semibold text-green-900 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-green-50"
            >
              {text("contact.hero.buttons.quote")}
              <ArrowRight className="h-5 w-5" />
            </a>

            <a
              href="#contact-form"
              className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
            >
              {text("contact.hero.buttons.enquiry")}
            </a>
          </div>

          <p className="mt-5 text-sm text-green-200/80">
            {text("contact.hero.supportingText")}
          </p>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <HeroHighlight
              icon={<Mail className="h-6 w-6" />}
              value={email || text("contact.hero.highlights.response.value")}
              label={text("contact.hero.highlights.response.label")}
            />
            <HeroHighlight
              icon={<Globe2 className="h-6 w-6" />}
              value={text("contact.hero.highlights.support.value")}
              label={text("contact.hero.highlights.support.label")}
            />
            <HeroHighlight
              icon={<Phone className="h-6 w-6" />}
              value={phone || text("contact.hero.highlights.assistance.value")}
              label={text("contact.hero.highlights.assistance.label")}
            />
            <HeroHighlight
              icon={<MessageCircle className="h-6 w-6" />}
              value={text("contact.hero.highlights.partnerships.value")}
              label={text("contact.hero.highlights.partnerships.label")}
            />
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="bg-gray-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge={text("contact.information.badge")}
            title={text("contact.information.title.line1")}
            titleLine2={text("contact.information.title.line2")}
            description={text("contact.information.description")}
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <ContactCard
              icon={<Building2 className="h-7 w-7" />}
              title="Business Identity"
              details={[
                companyName,
                "Customer Website",
                "Business enquiries and commercial partnerships",
              ]}
            />
            <ContactCard
              icon={<MapPin className="h-7 w-7" />}
              title="Business Address"
              details={[
                address || "Address available on request",
                "Primary contact location",
                "Customer and commercial enquiries",
              ]}
            />
            <ContactCard
              icon={<Mail className="h-7 w-7" />}
              title="Business Email"
              details={[
                email || "Email available on request",
                "General business enquiries",
                "Quotations and partnerships",
              ]}
            />
            <ContactCard
              icon={<Phone className="h-7 w-7" />}
              title="Business Support"
              details={[
                phone || "Phone available on request",
                whatsapp ? `WhatsApp: ${whatsapp}` : "WhatsApp available on request",
                "Buyer and order support",
              ]}
            />
          </div>

          <div className="mx-auto mt-20 max-w-3xl text-center">
            <h3 className="text-2xl font-bold text-gray-900">
              {companyName} Buyer Support
            </h3>
            <p className="mt-4 leading-8 text-gray-600">
              Share your sourcing requirements, product questions, packaging
              needs, destination information, or commercial enquiry and the
              tenant team can respond with the relevant next steps.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section
        id="contact-form"
        className="bg-gradient-to-b from-green-50 to-white py-20 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
                {text("contact.form.badge")}
              </span>

              <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                {text("contact.form.title.line1")}
                <span className="block text-green-700">
                  {text("contact.form.title.line2")}
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                {text("contact.form.description")}
              </p>

              <div className="mt-10 space-y-5">
                {[
                  text("contact.form.benefits.consultation"),
                  text("contact.form.benefits.bulkOrders"),
                  text("contact.form.benefits.privateLabel"),
                  text("contact.form.benefits.sourcing"),
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-700" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-3xl border border-green-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-green-700" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {companyName} Information Security
                  </h3>
                </div>

                <p className="mt-4 leading-7 text-gray-600">
                  Your enquiry is used to respond to your business
                  requirements. Please avoid sharing passwords, payment card
                  information, or other sensitive credentials in this form.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl lg:p-10">
              {success && (
                <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-700" />
                    <div>
                      <h3 className="font-semibold text-green-900">
                        {text("contact.form.success.title")}
                      </h3>
                      <p className="mt-1 text-sm text-green-700">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormInput
                    icon={<User className="h-5 w-5" />}
                    label={text("contact.form.fields.contactPerson")}
                    value={form.contactPerson}
                    placeholder={text(
                      "contact.form.placeholders.contactPerson",
                    )}
                    onChange={(value) =>
                      updateField("contactPerson", value)
                    }
                    required
                  />
                  <FormInput
                    icon={<Building2 className="h-5 w-5" />}
                    label={text("contact.form.fields.companyName")}
                    value={form.companyName}
                    placeholder={text(
                      "contact.form.placeholders.companyName",
                    )}
                    onChange={(value) =>
                      updateField("companyName", value)
                    }
                    required
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormInput
                    icon={<Mail className="h-5 w-5" />}
                    label={text("contact.form.fields.email")}
                    type="email"
                    value={form.email}
                    placeholder={text("contact.form.placeholders.email")}
                    onChange={(value) => updateField("email", value)}
                    required
                  />
                  <FormInput
                    icon={<Phone className="h-5 w-5" />}
                    label={text("contact.form.fields.phone")}
                    type="tel"
                    value={form.phone}
                    placeholder={text("contact.form.placeholders.phone")}
                    onChange={(value) => updateField("phone", value)}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormInput
                    icon={<Globe2 className="h-5 w-5" />}
                    label={text("contact.form.fields.country")}
                    value={form.country}
                    placeholder={text("contact.form.placeholders.country")}
                    onChange={(value) => updateField("country", value)}
                    required
                  />

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {text("contact.form.fields.product")}
                    </label>
                    <div className="relative">
                      <Package className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <select
                        required
                        value={form.productId}
                        onChange={(event) => updateProduct(event.target.value)}
                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-green-600"
                      >
                        <option value="">
                          {text("contact.form.options.selectProduct")}
                        </option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                        <option value="__other__">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormInput
                    icon={<Package className="h-5 w-5" />}
                    label={text("contact.form.fields.quantity")}
                    value={form.quantity}
                    placeholder={text("contact.form.placeholders.quantity")}
                    onChange={(value) => updateField("quantity", value)}
                  />
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {text("contact.form.fields.unit")}
                    </label>
                    <div className="relative">
                      <Ruler className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <select
                        value={form.unit}
                        onChange={(event) =>
                          updateField("unit", event.target.value)
                        }
                        className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-green-600"
                      >
                        <option value="">
                          {text("contact.form.options.selectUnit")}
                        </option>
                        {unitOptions.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {text("contact.form.fields.requirement")}
                  </label>
                  <div className="relative">
                    <MessageCircle className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(event) =>
                        updateField("message", event.target.value)
                      }
                      placeholder={text(
                        "contact.form.placeholders.requirement",
                      )}
                      className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-green-600"
                    />
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {text("contact.form.helperText")}
                  </p>
                </div>

                <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-green-700" />
                    <div>
                      <h3 className="font-semibold text-green-900">
                        Your Information Is Secure
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-green-800">
                        Your enquiry is sent to {companyName}'s enquiry
                        workflow for review and response.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-4"
                  disabled={submitting}
                >
                  {submitting ? (
                    "Submitting Enquiry..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {text("contact.form.buttons.submit")}
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-gray-500">
                  Your information is kept confidential and used only to
                  respond to your enquiry.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Business Location */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge={text("contact.locations.badge")}
            title={text("contact.locations.title.line1")}
            titleLine2={text("contact.locations.title.line2")}
            description={text("contact.locations.description")}
          />

          <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
            <div className="flex h-56 items-center justify-center bg-gradient-to-br from-green-100 via-green-50 to-white">
              <div className="text-center">
                <MapPin className="mx-auto h-12 w-12 text-green-700" />
                <p className="mt-4 font-semibold text-gray-700">
                  {companyName}
                </p>
                <p className="mt-2 max-w-md text-sm text-gray-500">
                  {address || "Business location available on request"}
                </p>
              </div>
            </div>

            <div className="p-8">
              <div className="inline-flex rounded-xl bg-green-100 p-3">
                <Building2 className="h-6 w-6 text-green-700" />
              </div>

              <h3 className="mt-5 text-2xl font-bold text-gray-900">
                Business Location
              </h3>

              <div className="mt-3 flex items-start gap-2 text-green-700">
                <MapPin className="mt-0.5 h-4 w-4" />
                <span className="font-medium">
                  {address || "Address available on request"}
                </span>
              </div>

              <p className="mt-6 leading-7 text-gray-600">
                Contact the tenant team for office visits, commercial
                discussions, sourcing enquiries, and export coordination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="bg-gray-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading
            badge={text("contact.support.badge")}
            title={text("contact.support.title.line1")}
            titleLine2={text("contact.support.title.line2")}
            description={text("contact.support.description")}
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            <SupportCard
              icon={<Clock3 className="h-7 w-7" />}
              title="Business enquiries"
              description="Submit an enquiry with your product and commercial requirements."
            />
            <SupportCard
              icon={<Mail className="h-7 w-7" />}
              title="Email support"
              description={
                email
                  ? `Reach the team at ${email}.`
                  : "Business email is available on request."
              }
            />
            <SupportCard
              icon={<Phone className="h-7 w-7" />}
              title="Phone support"
              description={
                phone
                  ? `Contact the team at ${phone}.`
                  : "Business phone is available on request."
              }
            />
            <SupportCard
              icon={<ShieldCheck className="h-7 w-7" />}
              title="Structured enquiries"
              description="Product and business requirements are captured for follow-up."
            />
          </div>

          <div className="mt-16 rounded-3xl border border-green-200 bg-white p-10 text-center shadow-sm">
            <MessageCircle className="mx-auto h-12 w-12 text-green-700" />
            <h3 className="mt-6 text-3xl font-bold text-gray-900">
              Need help before submitting?
            </h3>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-gray-600">
              Review the products page for available products and specifications,
              or submit the form above with your commercial requirements.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <SectionHeading
            badge={text("contact.faq.badge")}
            title={text("contact.faq.title.line1")}
            titleLine2={text("contact.faq.title.line2")}
            description={text("contact.faq.description")}
          />

          <div className="mt-12 space-y-4">
            {faqKeys.map(([questionKey, answerKey], index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={questionKey}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 p-6 text-left"
                  >
                    <span className="text-lg font-semibold text-gray-900">
                      {text(`contact.faq.questions.${questionKey}`)}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 flex-shrink-0 text-green-700 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 leading-7 text-gray-600">
                        {text(`contact.faq.questions.${answerKey}`)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-950 py-24">
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-green-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-green-500/10 blur-3xl" />
          <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-white/10 px-5 py-2 text-sm font-semibold text-green-100 backdrop-blur-md">
              <MessageCircle className="h-4 w-4 text-green-300" />
              {text("contact.cta.badge")}
            </span>

            <h2 className="mt-8 text-4xl font-bold tracking-tight text-white md:text-6xl">
              {text("contact.cta.title.line1")}
              <span className="block bg-gradient-to-r from-green-300 via-emerald-200 to-lime-300 bg-clip-text text-transparent">
                {text("contact.cta.title.line2")}
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-green-100/90">
              {text("contact.cta.description")}
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={quoteHref}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-green-900 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-green-50"
              >
                {text("contact.cta.buttons.quote")}
                <ArrowRight className="h-5 w-5" />
              </a>

              <a
                href={productsHref}
                className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
              >
                {text("contact.cta.buttons.products")}
              </a>
            </div>

            <div className="mt-20 grid gap-6 md:grid-cols-3">
              <CtaFeature
                icon={<Globe2 className="h-10 w-10" />}
                title="Product discovery"
              />
              <CtaFeature
                icon={<Mail className="h-10 w-10" />}
                title="Business enquiries"
              />
              <CtaFeature
                icon={<Phone className="h-10 w-10" />}
                title="Commercial support"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroHighlight({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-green-300">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-bold text-white">{value}</h3>
      <p className="mt-2 text-sm leading-6 text-green-100/80">{label}</p>
    </div>
  );
}

function SectionHeading({
  badge,
  title,
  titleLine2,
  description,
}: {
  badge: string;
  title: string;
  titleLine2?: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className="inline-flex rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
        {badge}
      </span>
      <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
        {title}
        {titleLine2 && (
          <span className="block text-green-700">{titleLine2}</span>
        )}
      </h2>
      <p className="mt-6 text-lg leading-8 text-gray-600">{description}</p>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  details,
}: {
  icon: React.ReactNode;
  title: string;
  details: string[];
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl">
      <div className="inline-flex rounded-2xl bg-green-100 p-4 text-green-700">
        {icon}
      </div>
      <h3 className="mt-6 text-2xl font-bold text-gray-900">{title}</h3>
      <div className="mt-4 space-y-2">
        {details.map((detail) => (
          <p key={detail} className="text-gray-600">
            {detail}
          </p>
        ))}
      </div>
    </div>
  );
}

function SupportCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-green-300 hover:shadow-xl">
      <div className="inline-flex rounded-2xl bg-green-100 p-4 text-green-700">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-bold text-gray-900">{title}</h3>
      <p className="mt-4 leading-7 text-gray-600">{description}</p>
    </div>
  );
}

function CtaFeature({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
      <div className="mx-auto text-green-300">{icon}</div>
      <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>
    </div>
  );
}

function FormInput({
  icon,
  label,
  value,
  placeholder,
  onChange,
  required,
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | undefined;
  placeholder: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        <input
          type={type}
          required={required}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-green-600"
        />
      </div>
    </div>
  );
}
