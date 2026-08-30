"use client";

import {
  FormEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Archive,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  Save,
  Send,
  Trash2,
} from "lucide-react";

import { CmsPageStatus } from "@/lib/generated/prisma";

import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type {
  PageLayout,
  PageTemplate,
} from "@/components/admin/cms/pages/types";

type HeroSection = {
  type: "hero";
  heading: string;
  subheading: string;
  primaryCtaText: string;
  secondaryCtaText: string;
};

type ValuePropositionSection = {
  type: "valueProposition";
  heading: string;
  description: string;
  points: string[];
};

type ProductSection = {
  type: "product";
  heading: string;
  description: string;
  productName: string;
  origin: string;
  form: string;
  packaging: string;
  moq: string;
  applications: string[];
};

type ApplicationsSection = {
  type: "applications";
  heading: string;
  description: string;
  items: Array<{
    title: string;
    description: string;
  }>;
};

type WhyRootymSection = {
  type: "whyRootym";
  heading: string;
  points: Array<{
    title: string;
    description: string;
  }>;
};

type BuyerFocusSection = {
  type: "buyerFocus";
  heading: string;
  description: string;
  buyerTypes: string[];
};

type PackagingSection = {
  type: "packaging";
  heading: string;
  description: string;
  options: string[];
};

type ExportDocumentsSection = {
  type: "exportDocuments";
  heading: string;
  description: string;
  documents: string[];
};

type CtaSection = {
  type: "cta";
  heading: string;
  description: string;
  primaryCtaText: string;
  secondaryCtaText: string;
};

type FaqSection = {
  type: "faq";
  heading: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
};

type LandingPageSection =
  | HeroSection
  | ValuePropositionSection
  | ProductSection
  | ApplicationsSection
  | WhyRootymSection
  | BuyerFocusSection
  | PackagingSection
  | ExportDocumentsSection
  | CtaSection
  | FaqSection;

type StructuredContent = {
  version: 1;
  template: PageTemplate;
  sections: LandingPageSection[];
};

type FormState = {
  internalTitle: string;
  title: string;
  slug: string;
  status: CmsPageStatus;
  template: PageTemplate;
  layout: PageLayout;
  isHomePage: boolean;
  showInMenu: boolean;
  excerpt: string;
  content: string;
  structuredContent: StructuredContent;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
};

function createDefaultStructuredContent(
  template: PageTemplate
): StructuredContent {
  return {
    version: 1,
    template,
    sections: [
      {
        type: "hero",
        heading: "",
        subheading: "",
        primaryCtaText: "",
        secondaryCtaText: "",
      },
      {
        type: "valueProposition",
        heading: "",
        description: "",
        points: [],
      },
      {
        type: "product",
        heading: "",
        description: "",
        productName: "",
        origin: "",
        form: "",
        packaging: "",
        moq: "",
        applications: [],
      },
      {
        type: "applications",
        heading: "",
        description: "",
        items: [],
      },
      {
        type: "whyRootym",
        heading: "",
        points: [],
      },
      {
        type: "buyerFocus",
        heading: "",
        description: "",
        buyerTypes: [],
      },
      {
        type: "packaging",
        heading: "",
        description: "",
        options: [],
      },
      {
        type: "exportDocuments",
        heading: "",
        description: "",
        documents: [],
      },
      {
        type: "cta",
        heading: "",
        description: "",
        primaryCtaText: "",
        secondaryCtaText: "",
      },
      {
        type: "faq",
        heading: "",
        items: [],
      },
    ],
  };
}

function normalizeStructuredContent(
  value: unknown,
  template: PageTemplate
): StructuredContent {
  const defaults = createDefaultStructuredContent(template);

  if (!value || typeof value !== "object") {
    return defaults;
  }

  const candidate = value as {
    version?: unknown;
    template?: unknown;
    sections?: unknown;
  };

  if (
    candidate.version !== 1 ||
    !Array.isArray(candidate.sections)
  ) {
    return defaults;
  }

  const existingSections = candidate.sections as LandingPageSection[];

  return {
    version: 1,
    template:
      candidate.template === "COUNTRY_LANDING"
        ? "COUNTRY_LANDING"
        : template,
    sections: defaults.sections.map((defaultSection) => {
      return (
        existingSections.find(
          (section) =>
            section &&
            typeof section === "object" &&
            section.type === defaultSection.type
        ) ?? defaultSection
      );
    }),
  };
}

const INITIAL_FORM: FormState = {
  internalTitle: "",
  title: "",
  slug: "",
  status: CmsPageStatus.DRAFT,
  template: "STANDARD",
  layout: "WEBSITE",
  isHomePage: false,
  showInMenu: true,
  excerpt: "",
  content: "",
  structuredContent:
    createDefaultStructuredContent("STANDARD"),
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  canonicalUrl: "",
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getErrorMessage(
  result: unknown,
  fallback: string
) {
  if (!result || typeof result !== "object") {
    return fallback;
  }

  const data = result as {
    message?: unknown;
    error?: unknown;
    details?: unknown;
  };

  if (typeof data.message === "string") {
    return data.message;
  }

  if (typeof data.error === "string") {
    return data.error;
  }

  if (
    data.error &&
    typeof data.error === "object"
  ) {
    const nested = data.error as {
      message?: unknown;
    };

    if (typeof nested.message === "string") {
      return nested.message;
    }
  }

  if (Array.isArray(data.details)) {
    const messages = data.details
      .map((detail) => {
        if (!detail || typeof detail !== "object") {
          return "";
        }

        const item = detail as {
          message?: unknown;
          path?: unknown;
        };

        const message =
          typeof item.message === "string"
            ? item.message
            : "";

        const path = Array.isArray(item.path)
          ? item.path.join(".")
          : "";

        return path ? `${path}: ${message}` : message;
      })
      .filter(Boolean);

    if (messages.length) {
      return messages.join(" | ");
    }
  }

  return fallback;
}

function SectionHeader({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5 flex items-start gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm font-bold text-[#2E7D32]">
        {number}
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900">
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function TextArrayEditor({
  label,
  values,
  placeholder,
  onChange,
  onAdd,
  onRemove,
}: {
  label: string;
  values: string[];
  placeholder: string;
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="outline"
          onClick={onAdd}
          className="h-9"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {values.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
          No items added yet.
        </p>
      ) : (
        values.map((value, index) => (
          <div
            key={`${label}-${index}`}
            className="flex items-center gap-2"
          >
            <Input
              value={value}
              placeholder={placeholder}
              onChange={(event) =>
                onChange(index, event.target.value)
              }
            />
            <Button
              type="button"
              variant="outline"
              className="h-10 w-10 shrink-0 px-0"
              onClick={() => onRemove(index)}
              aria-label={`Remove ${label} ${index + 1}`}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))
      )}
    </div>
  );
}

function ObjectArrayEditor({
  label,
  values,
  firstPlaceholder,
  secondPlaceholder,
  onChange,
  onAdd,
  onRemove,
}: {
  label: string;
  values: Array<{
    title: string;
    description: string;
  }>;
  firstPlaceholder: string;
  secondPlaceholder: string;
  onChange: (
    index: number,
    field: "title" | "description",
    value: string
  ) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        <Button
          type="button"
          variant="outline"
          onClick={onAdd}
          className="h-9"
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      {values.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
          No items added yet.
        </p>
      ) : (
        values.map((item, index) => (
          <div
            key={`${label}-${index}`}
            className="rounded-xl border border-gray-200 p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Item {index + 1}
              </span>
              <Button
                type="button"
                variant="outline"
                className="h-8 w-8 px-0"
                onClick={() => onRemove(index)}
                aria-label={`Remove ${label} ${index + 1}`}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                value={item.title}
                placeholder={firstPlaceholder}
                onChange={(event) =>
                  onChange(
                    index,
                    "title",
                    event.target.value
                  )
                }
              />

              <Textarea
                value={item.description}
                placeholder={secondPlaceholder}
                rows={3}
                onChange={(event) =>
                  onChange(
                    index,
                    "description",
                    event.target.value
                  )
                }
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function EditCmsPage() {
  const router = useRouter();
  const params = useParams();

  const pageId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [form, setForm] =
    useState<FormState>(INITIAL_FORM);

  const [slugManuallyEdited, setSlugManuallyEdited] =
    useState(true);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [openSections, setOpenSections] =
    useState<Record<string, boolean>>({
      hero: true,
      valueProposition: true,
      product: true,
      applications: true,
      whyRootym: true,
      buyerFocus: true,
      packaging: true,
      exportDocuments: true,
      cta: true,
      faq: true,
    });

  useEffect(() => {
    if (!pageId) {
      setError("CMS page ID is missing.");
      setIsLoading(false);
      return;
    }

    async function loadPage() {
      try {
        setError("");

        const response = await fetch(
          `/api/admin/cms/pages/${pageId}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const result = await response
          .json()
          .catch(() => null);

        if (!response.ok) {
          throw new Error(
            getErrorMessage(
              result,
              "Failed to load CMS page."
            )
          );
        }

        const page = result?.data;

        if (!page) {
          throw new Error(
            "CMS page data was not returned."
          );
        }

        const defaultTranslation =
          page.translations?.find(
            (translation: {
              language?: {
                isDefault?: boolean;
              };
            }) =>
              translation.language?.isDefault
          ) ?? page.translations?.[0];

        const template: PageTemplate =
          page.template === "COUNTRY_LANDING"
            ? "COUNTRY_LANDING"
            : "STANDARD";

        const structuredContent =
          normalizeStructuredContent(
            defaultTranslation?.structuredContent,
            template
          );

        setForm({
          internalTitle: page.title ?? "",
          title:
            defaultTranslation?.title ??
            page.title ??
            "",
          slug:
            defaultTranslation?.slug ??
            page.slug ??
            "",
          status:
            page.status ??
            CmsPageStatus.DRAFT,
          template,
          layout:
            page.layout === "STANDALONE"
              ? "STANDALONE"
              : "WEBSITE",
          isHomePage:
            page.isHomePage ?? false,
          showInMenu:
            page.showInMenu ?? true,
          excerpt:
            defaultTranslation?.excerpt ??
            "",
          content:
            defaultTranslation?.content ??
            "",
          structuredContent,
          metaTitle:
            defaultTranslation?.metaTitle ??
            page.metaTitle ??
            "",
          metaDescription:
            defaultTranslation?.metaDescription ??
            page.metaDescription ??
            "",
          metaKeywords:
            defaultTranslation?.metaKeywords ??
            page.metaKeywords ??
            "",
          canonicalUrl:
            page.canonicalUrl ??
            "",
        });

        setSlugManuallyEdited(true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load CMS page."
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadPage();
  }, [pageId]);

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugManuallyEdited
        ? current.slug
        : createSlug(value),
    }));
  }

  function updateSection(
    type: LandingPageSection["type"],
    patch: Record<string, unknown>
  ) {
    setForm((current) => ({
      ...current,
      structuredContent: {
        ...current.structuredContent,
        sections:
          current.structuredContent.sections.map(
            (section) =>
              section.type === type
                ? ({
                    ...section,
                    ...patch,
                  } as LandingPageSection)
                : section
          ),
      },
    }));
  }

  function getSection<T extends LandingPageSection["type"]>(
    type: T
  ): Extract<LandingPageSection, { type: T }> {
    return form.structuredContent.sections.find(
      (section) => section.type === type
    ) as Extract<LandingPageSection, { type: T }>;
  }

  function updateStringArrayItem(
    type: LandingPageSection["type"],
    key:
      | "points"
      | "applications"
      | "buyerTypes"
      | "options"
      | "documents",
    index: number,
    value: string
  ) {
    const section = form.structuredContent.sections.find(
      (item) => item.type === type
    ) as unknown as Record<string, unknown>;

    const values = Array.isArray(section?.[key])
      ? [...(section[key] as string[])]
      : [];

    values[index] = value;
    updateSection(type, { [key]: values });
  }

  function addStringArrayItem(
    type: LandingPageSection["type"],
    key:
      | "points"
      | "applications"
      | "buyerTypes"
      | "options"
      | "documents"
  ) {
    const section = form.structuredContent.sections.find(
      (item) => item.type === type
    ) as unknown as Record<string, unknown>;

    const values = Array.isArray(section?.[key])
      ? [...(section[key] as string[])]
      : [];

    values.push("");
    updateSection(type, { [key]: values });
  }

  function removeStringArrayItem(
    type: LandingPageSection["type"],
    key:
      | "points"
      | "applications"
      | "buyerTypes"
      | "options"
      | "documents",
    index: number
  ) {
    const section = form.structuredContent.sections.find(
      (item) => item.type === type
    ) as unknown as Record<string, unknown>;

    const values = Array.isArray(section?.[key])
      ? [...(section[key] as string[])]
      : [];

    values.splice(index, 1);
    updateSection(type, { [key]: values });
  }

  function updateObjectArrayItem(
    type: "applications" | "whyRootym" | "faq",
    key: "items" | "points",
    index: number,
    field: "title" | "description" | "question" | "answer",
    value: string
  ) {
    const section = form.structuredContent.sections.find(
      (item) => item.type === type
    ) as unknown as Record<string, unknown>;

    const values = Array.isArray(section?.[key])
      ? [...(section[key] as Array<Record<string, string>>)]
      : [];

    values[index] = {
      ...values[index],
      [field]: value,
    };

    updateSection(type, { [key]: values });
  }

  function addObjectArrayItem(
    type: "applications" | "whyRootym" | "faq",
    key: "items" | "points"
  ) {
    const section = form.structuredContent.sections.find(
      (item) => item.type === type
    ) as unknown as Record<string, unknown>;

    const values = Array.isArray(section?.[key])
      ? [...(section[key] as Array<Record<string, string>>)]
      : [];

    values.push(
      type === "faq"
        ? { question: "", answer: "" }
        : { title: "", description: "" }
    );

    updateSection(type, { [key]: values });
  }

  function removeObjectArrayItem(
    type: "applications" | "whyRootym" | "faq",
    key: "items" | "points",
    index: number
  ) {
    const section = form.structuredContent.sections.find(
      (item) => item.type === type
    ) as unknown as Record<string, unknown>;

    const values = Array.isArray(section?.[key])
      ? [...(section[key] as Array<Record<string, string>>)]
      : [];

    values.splice(index, 1);
    updateSection(type, { [key]: values });
  }

  function toggleSection(type: LandingPageSection["type"]) {
    setOpenSections((current) => ({
      ...current,
      [type]: !current[type],
    }));
  }

  function renderSectionCard(
    type: LandingPageSection["type"],
    number: number,
    title: string,
    description: string,
    children: ReactNode
  ) {
    return (
      <Card
        hover={false}
        className="overflow-hidden p-0"
      >
        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 p-6 text-left"
          onClick={() => toggleSection(type)}
        >
          <SectionHeader
            number={number}
            title={title}
            description={description}
          />
          {openSections[type] ? (
            <ChevronUp className="h-5 w-5 shrink-0 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />
          )}
        </button>

        {openSections[type] && (
          <div className="border-t border-gray-100 p-6">
            {children}
          </div>
        )}
      </Card>
    );
  }

  function renderStructuredSections() {
    const hero = getSection("hero");
    const valueProposition = getSection("valueProposition");
    const product = getSection("product");
    const applications = getSection("applications");
    const whyRootym = getSection("whyRootym");
    const buyerFocus = getSection("buyerFocus");
    const packaging = getSection("packaging");
    const exportDocuments = getSection("exportDocuments");
    const cta = getSection("cta");
    const faq = getSection("faq");

    return (
      <div className="space-y-4">
        {renderSectionCard(
          "hero",
          1,
          "Hero",
          "Primary headline, supporting message and calls to action.",
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Heading</Label>
              <Input
                value={hero.heading}
                placeholder="Dehydrated Onion Flakes from India"
                onChange={(event) =>
                  updateSection("hero", {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Subheading</Label>
              <Textarea
                value={hero.subheading}
                placeholder="Premium Indian dehydrated onion flakes for importers, distributors and food manufacturers."
                rows={4}
                onChange={(event) =>
                  updateSection("hero", {
                    subheading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Primary CTA</Label>
              <Input
                value={hero.primaryCtaText}
                placeholder="Request a Quote"
                onChange={(event) =>
                  updateSection("hero", {
                    primaryCtaText:
                      event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary CTA</Label>
              <Input
                value={hero.secondaryCtaText}
                placeholder="View Product Details"
                onChange={(event) =>
                  updateSection("hero", {
                    secondaryCtaText:
                      event.target.value,
                  })
                }
              />
            </div>
          </div>
        )}

        {renderSectionCard(
          "valueProposition",
          2,
          "Value Proposition",
          "Explain why the product is relevant to the target market.",
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={valueProposition.heading}
                placeholder="Consistent Indian supply for global buyers"
                onChange={(event) =>
                  updateSection("valueProposition", {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={valueProposition.description}
                rows={4}
                onChange={(event) =>
                  updateSection("valueProposition", {
                    description:
                      event.target.value,
                  })
                }
              />
            </div>
            <TextArrayEditor
              label="Key Points"
              values={valueProposition.points}
              placeholder="Reliable sourcing and export-ready supply"
              onChange={(index, value) =>
                updateStringArrayItem(
                  "valueProposition",
                  "points",
                  index,
                  value
                )
              }
              onAdd={() =>
                addStringArrayItem(
                  "valueProposition",
                  "points"
                )
              }
              onRemove={(index) =>
                removeStringArrayItem(
                  "valueProposition",
                  "points",
                  index
                )
              }
            />
          </div>
        )}

        {renderSectionCard(
          "product",
          3,
          "Product",
          "Capture the core product specifications buyers need before making an enquiry.",
          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Heading</Label>
                <Input
                  value={product.heading}
                  placeholder="Premium Dehydrated Onion Flakes"
                  onChange={(event) =>
                    updateSection("product", {
                      heading: event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={product.description}
                  rows={4}
                  onChange={(event) =>
                    updateSection("product", {
                      description:
                        event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  value={product.productName}
                  onChange={(event) =>
                    updateSection("product", {
                      productName:
                        event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Origin</Label>
                <Input
                  value={product.origin}
                  placeholder="Nashik, Maharashtra, India"
                  onChange={(event) =>
                    updateSection("product", {
                      origin: event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Form</Label>
                <Input
                  value={product.form}
                  placeholder="Flakes"
                  onChange={(event) =>
                    updateSection("product", {
                      form: event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Packaging</Label>
                <Input
                  value={product.packaging}
                  placeholder="Bulk export cartons / food-grade bags"
                  onChange={(event) =>
                    updateSection("product", {
                      packaging:
                        event.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>MOQ</Label>
                <Input
                  value={product.moq}
                  placeholder="1 MT or buyer requirement"
                  onChange={(event) =>
                    updateSection("product", {
                      moq: event.target.value,
                    })
                  }
                />
              </div>
            </div>

            <TextArrayEditor
              label="Applications"
              values={product.applications}
              placeholder="Food manufacturing"
              onChange={(index, value) =>
                updateStringArrayItem(
                  "product",
                  "applications",
                  index,
                  value
                )
              }
              onAdd={() =>
                addStringArrayItem(
                  "product",
                  "applications"
                )
              }
              onRemove={(index) =>
                removeStringArrayItem(
                  "product",
                  "applications",
                  index
                )
              }
            />
          </div>
        )}

        {renderSectionCard(
          "applications",
          4,
          "Applications",
          "Show where and how the product is used by commercial buyers.",
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={applications.heading}
                onChange={(event) =>
                  updateSection("applications", {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={applications.description}
                rows={4}
                onChange={(event) =>
                  updateSection("applications", {
                    description:
                      event.target.value,
                  })
                }
              />
            </div>
            <ObjectArrayEditor
              label="Application Items"
              values={applications.items}
              firstPlaceholder="Food processing"
              secondPlaceholder="Describe the application and buyer use case."
              onChange={(index, field, value) =>
                updateObjectArrayItem(
                  "applications",
                  "items",
                  index,
                  field,
                  value
                )
              }
              onAdd={() =>
                addObjectArrayItem(
                  "applications",
                  "items"
                )
              }
              onRemove={(index) =>
                removeObjectArrayItem(
                  "applications",
                  "items",
                  index
                )
              }
            />
          </div>
        )}

        {renderSectionCard(
          "whyRootym",
          5,
          "Why ROOTYM",
          "Build buyer confidence around sourcing, quality and export execution.",
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={whyRootym.heading}
                onChange={(event) =>
                  updateSection("whyRootym", {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <ObjectArrayEditor
              label="Why ROOTYM Points"
              values={whyRootym.points}
              firstPlaceholder="Quality-focused sourcing"
              secondPlaceholder="Explain the buyer benefit."
              onChange={(index, field, value) =>
                updateObjectArrayItem(
                  "whyRootym",
                  "points",
                  index,
                  field,
                  value
                )
              }
              onAdd={() =>
                addObjectArrayItem(
                  "whyRootym",
                  "points"
                )
              }
              onRemove={(index) =>
                removeObjectArrayItem(
                  "whyRootym",
                  "points",
                  index
                )
              }
            />
          </div>
        )}

        {renderSectionCard(
          "buyerFocus",
          6,
          "Buyer Focus",
          "Define the buyer profiles and commercial audiences this page targets.",
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={buyerFocus.heading}
                onChange={(event) =>
                  updateSection("buyerFocus", {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={buyerFocus.description}
                rows={4}
                onChange={(event) =>
                  updateSection("buyerFocus", {
                    description:
                      event.target.value,
                  })
                }
              />
            </div>
            <TextArrayEditor
              label="Buyer Types"
              values={buyerFocus.buyerTypes}
              placeholder="Food ingredient importer"
              onChange={(index, value) =>
                updateStringArrayItem(
                  "buyerFocus",
                  "buyerTypes",
                  index,
                  value
                )
              }
              onAdd={() =>
                addStringArrayItem(
                  "buyerFocus",
                  "buyerTypes"
                )
              }
              onRemove={(index) =>
                removeStringArrayItem(
                  "buyerFocus",
                  "buyerTypes",
                  index
                )
              }
            />
          </div>
        )}

        {renderSectionCard(
          "packaging",
          7,
          "Packaging",
          "Present practical packaging choices for export buyers.",
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={packaging.heading}
                onChange={(event) =>
                  updateSection("packaging", {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={packaging.description}
                rows={4}
                onChange={(event) =>
                  updateSection("packaging", {
                    description:
                      event.target.value,
                  })
                }
              />
            </div>
            <TextArrayEditor
              label="Packaging Options"
              values={packaging.options}
              placeholder="25 kg food-grade export bag"
              onChange={(index, value) =>
                updateStringArrayItem(
                  "packaging",
                  "options",
                  index,
                  value
                )
              }
              onAdd={() =>
                addStringArrayItem(
                  "packaging",
                  "options"
                )
              }
              onRemove={(index) =>
                removeStringArrayItem(
                  "packaging",
                  "options",
                  index
                )
              }
            />
          </div>
        )}

        {renderSectionCard(
          "exportDocuments",
          8,
          "Export Documents",
          "List the standard export documentation buyers can expect from ROOTYM.",
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={exportDocuments.heading}
                onChange={(event) =>
                  updateSection("exportDocuments", {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={exportDocuments.description}
                rows={4}
                onChange={(event) =>
                  updateSection("exportDocuments", {
                    description:
                      event.target.value,
                  })
                }
              />
            </div>
            <TextArrayEditor
              label="Documents"
              values={exportDocuments.documents}
              placeholder="Commercial Invoice"
              onChange={(index, value) =>
                updateStringArrayItem(
                  "exportDocuments",
                  "documents",
                  index,
                  value
                )
              }
              onAdd={() =>
                addStringArrayItem(
                  "exportDocuments",
                  "documents"
                )
              }
              onRemove={(index) =>
                removeStringArrayItem(
                  "exportDocuments",
                  "documents",
                  index
                )
              }
            />
          </div>
        )}

        {renderSectionCard(
          "cta",
          9,
          "CTA",
          "Close the page with a clear commercial action for the buyer.",
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Heading</Label>
              <Input
                value={cta.heading}
                onChange={(event) =>
                  updateSection("cta", {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={cta.description}
                rows={4}
                onChange={(event) =>
                  updateSection("cta", {
                    description: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Primary CTA</Label>
              <Input
                value={cta.primaryCtaText}
                placeholder="Request a Quote"
                onChange={(event) =>
                  updateSection("cta", {
                    primaryCtaText:
                      event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary CTA</Label>
              <Input
                value={cta.secondaryCtaText}
                placeholder="Contact ROOTYM"
                onChange={(event) =>
                  updateSection("cta", {
                    secondaryCtaText:
                      event.target.value,
                  })
                }
              />
            </div>
          </div>
        )}

        {renderSectionCard(
          "faq",
          10,
          "FAQ",
          "Answer the most common buyer questions before they contact ROOTYM.",
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input
                value={faq.heading}
                onChange={(event) =>
                  updateSection("faq", {
                    heading: event.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label>Questions & Answers</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    addObjectArrayItem(
                      "faq",
                      "items"
                    )
                  }
                  className="h-9"
                >
                  <Plus className="h-4 w-4" />
                  Add FAQ
                </Button>
              </div>

              {faq.items.length === 0 ? (
                <p className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
                  No FAQs added yet.
                </p>
              ) : (
                faq.items.map((item, index) => (
                  <div
                    key={`faq-${index}`}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        FAQ {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 w-8 px-0"
                        onClick={() =>
                          removeObjectArrayItem(
                            "faq",
                            "items",
                            index
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Question</Label>
                        <Input
                          value={item.question}
                          onChange={(event) =>
                            updateObjectArrayItem(
                              "faq",
                              "items",
                              index,
                              "question",
                              event.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Answer</Label>
                        <Textarea
                          value={item.answer}
                          rows={4}
                          onChange={(event) =>
                            updateObjectArrayItem(
                              "faq",
                              "items",
                              index,
                              "answer",
                              event.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  async function handleSave(
    requestedStatus?: CmsPageStatus
  ) {
    setError("");
    setSuccess("");

    const internalTitle =
      form.internalTitle.trim();
    const title = form.title.trim();
    const slug = form.slug.trim();

    if (!internalTitle) {
      setError(
        "Internal page title is required."
      );
      return;
    }

    if (!title) {
      setError("Page title is required.");
      return;
    }

    if (!slug) {
      setError("Page slug is required.");
      return;
    }

    if (!pageId) {
      setError("CMS page ID is missing.");
      return;
    }

    const status =
      requestedStatus ?? form.status;

    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/admin/cms/pages/${pageId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: internalTitle,
            slug,
            status,
            template: form.template,
            layout: form.layout,
            isHomePage: form.isHomePage,
            showInMenu: form.showInMenu,
            ...(form.canonicalUrl.trim()
              ? {
                  canonicalUrl:
                    form.canonicalUrl.trim(),
                }
              : {}),
            metaTitle:
              form.metaTitle.trim(),
            metaDescription:
              form.metaDescription.trim(),
            metaKeywords:
              form.metaKeywords.trim(),
            translation: {
              title,
              slug,
              excerpt:
                form.excerpt.trim(),
              content: form.content,
              structuredContent:
                form.structuredContent,
              metaTitle:
                form.metaTitle.trim(),
              metaDescription:
                form.metaDescription.trim(),
              metaKeywords:
                form.metaKeywords.trim(),
              isPublished:
                status ===
                CmsPageStatus.PUBLISHED,
            },
          }),
        }
      );

      const result = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          getErrorMessage(
            result,
            "Failed to update CMS page."
          )
        );
      }

      const successMessage =
        status === CmsPageStatus.PUBLISHED
          ? "CMS page published successfully."
          : status === CmsPageStatus.ARCHIVED
            ? "CMS page archived successfully."
            : "CMS page saved as draft successfully.";

      setSuccess(successMessage);

      setTimeout(() => {
        router.push("/admin/cms/pages");
        router.refresh();
      }, 700);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update CMS page."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    void handleSave(form.status);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading CMS page...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div>
        <button
          type="button"
          onClick={() =>
            router.push("/admin/cms/pages")
          }
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#2E7D32]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to CMS Pages
        </button>

        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Edit CMS Page
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update page structure, content, publishing
          settings and SEO metadata.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <Card
          hover={false}
          className="p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              General
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Basic page information, template,
              presentation and publishing settings.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="internalTitle">
                Internal Page Title
              </Label>
              <Input
                id="internalTitle"
                value={form.internalTitle}
                onChange={(event) =>
                  updateField(
                    "internalTitle",
                    event.target.value
                  )
                }
                maxLength={200}
                required
              />
              <p className="text-xs text-gray-500">
                Used internally to identify the page
                in the CMS.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status
              </Label>
              <Select
                id="status"
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target
                      .value as CmsPageStatus
                  )
                }
                options={[
                  {
                    label: "Draft",
                    value: CmsPageStatus.DRAFT,
                  },
                  {
                    label: "Published",
                    value:
                      CmsPageStatus.PUBLISHED,
                  },
                  {
                    label: "Archived",
                    value:
                      CmsPageStatus.ARCHIVED,
                  },
                ]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">
                Page Template
              </Label>
              <Select
                id="template"
                value={form.template}
                onChange={(event) => {
                  const template =
                    event.target.value as PageTemplate;
                  updateField("template", template);
                  setForm((current) => ({
                    ...current,
                    template,
                    structuredContent: {
                      ...current.structuredContent,
                      template,
                    },
                  }));
                }}
                options={[
                  {
                    label: "Standard Page",
                    value: "STANDARD",
                  },
                  {
                    label: "Country Landing Page",
                    value: "COUNTRY_LANDING",
                  },
                ]}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="layout">
                Page Presentation
              </Label>
              <Select
                id="layout"
                value={form.layout}
                onChange={(event) =>
                  updateField(
                    "layout",
                    event.target.value as PageLayout
                  )
                }
                options={[
                  {
                    label: "ROOTYM Website",
                    value: "WEBSITE",
                  },
                  {
                    label: "Standalone Landing Page",
                    value: "STANDALONE",
                  },
                ]}
              />
              <p className="text-xs text-gray-500">
                Choose whether this page uses the
                ROOTYM website header and footer or
                works as a standalone landing page.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                Page Title
              </Label>
              <Input
                id="title"
                value={form.title}
                onChange={(event) =>
                  handleTitleChange(
                    event.target.value
                  )
                }
                maxLength={200}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                URL Slug
              </Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(event) => {
                  setSlugManuallyEdited(true);
                  updateField(
                    "slug",
                    createSlug(
                      event.target.value
                    )
                  );
                }}
                maxLength={200}
                required
              />
              <p className="text-xs text-gray-500">
                Public URL preview:{" "}
                <span className="font-medium text-gray-700">
                  {form.slug
                    ? `/${form.slug}`
                    : "/your-page-slug"}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
              <input
                id="showInMenu"
                type="checkbox"
                checked={form.showInMenu}
                onChange={(event) =>
                  updateField(
                    "showInMenu",
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-gray-300 accent-[#2E7D32]"
              />
              <div>
                <Label
                  htmlFor="showInMenu"
                  className="cursor-pointer"
                >
                  Show in Menu
                </Label>
                <p className="mt-1 text-xs text-gray-500">
                  Controls whether this page is intended
                  to appear in site navigation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
              <input
                id="isHomePage"
                type="checkbox"
                checked={form.isHomePage}
                onChange={(event) =>
                  updateField(
                    "isHomePage",
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-gray-300 accent-[#2E7D32]"
              />
              <div>
                <Label
                  htmlFor="isHomePage"
                  className="cursor-pointer"
                >
                  Set as Homepage
                </Label>
                <p className="mt-1 text-xs text-gray-500">
                  Only enable this when this page should
                  become the website homepage.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card
          hover={false}
          className="p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Structured Page Sections
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Build the real landing page from structured
              sections. Existing saved sections are loaded
              automatically from the default CMS language.
            </p>
          </div>

          <div className="mb-6 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800">
            The page currently uses the{" "}
            <strong>
              {form.template === "COUNTRY_LANDING"
                ? "Country Landing Page"
                : "Standard Page"}
            </strong>{" "}
            template. Complete the sections below before
            publishing.
          </div>

          {renderStructuredSections()}
        </Card>

        <Card
          hover={false}
          className="p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Legacy / Additional Content
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Optional plain-text content retained for
              compatibility with existing CMS pages.
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="excerpt">
                Excerpt
              </Label>
              <Textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(event) =>
                  updateField(
                    "excerpt",
                    event.target.value
                  )
                }
                maxLength={500}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">
                Page Content
              </Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(event) =>
                  updateField(
                    "content",
                    event.target.value
                  )
                }
                rows={10}
              />
            </div>
          </div>
        </Card>

        <Card
          hover={false}
          className="p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              SEO
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Search-engine metadata for this page.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">
                Meta Title
              </Label>
              <Input
                id="metaTitle"
                value={form.metaTitle}
                onChange={(event) =>
                  updateField(
                    "metaTitle",
                    event.target.value
                  )
                }
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="canonicalUrl">
                Canonical URL
              </Label>
              <Input
                id="canonicalUrl"
                type="url"
                value={form.canonicalUrl}
                onChange={(event) =>
                  updateField(
                    "canonicalUrl",
                    event.target.value
                  )
                }
             placeholder="https://export.rootym.com/..."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="metaDescription">
                Meta Description
              </Label>
              <Textarea
                id="metaDescription"
                value={form.metaDescription}
                onChange={(event) =>
                  updateField(
                    "metaDescription",
                    event.target.value
                  )
                }
                maxLength={500}
                rows={4}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="metaKeywords">
                Meta Keywords
              </Label>
              <Input
                id="metaKeywords"
                value={form.metaKeywords}
                onChange={(event) =>
                  updateField(
                    "metaKeywords",
                    event.target.value
                  )
                }
                maxLength={500}
              />
            </div>
          </div>
        </Card>

        <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push("/admin/cms/pages")
            }
            disabled={isSaving}
          >
            Cancel
          </Button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="submit"
              variant="outline"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : form.status ===
                CmsPageStatus.ARCHIVED ? (
                <Archive className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {form.status ===
              CmsPageStatus.ARCHIVED
                ? "Archive"
                : form.status ===
                    CmsPageStatus.PUBLISHED
                  ? "Save Changes"
                  : "Save Draft"}
            </Button>

            <Button
              type="button"
              variant="success"
              disabled={isSaving}
              onClick={() =>
                void handleSave(
                  CmsPageStatus.PUBLISHED
                )
              }
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Publish
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
