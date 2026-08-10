"use client";

import { useState } from "react";

import type {
  CmsLandingPageContent,
  LandingPageSection,
} from "@/components/admin/cms/pages/types";

import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type StructuredLandingPageEditorProps = {
  value: CmsLandingPageContent;
  onChange: (value: CmsLandingPageContent) => void;
};

const SECTION_OPTIONS = [
  {
    type: "hero",
    label: "Hero",
  },
  {
    type: "valueProposition",
    label: "Value Proposition",
  },
  {
    type: "product",
    label: "Product",
  },
  {
    type: "applications",
    label: "Applications",
  },
  {
    type: "whyRootym",
    label: "Why ROOTYM",
  },
  {
    type: "buyerFocus",
    label: "Buyer Focus",
  },
  {
    type: "packaging",
    label: "Packaging",
  },
  {
    type: "exportDocuments",
    label: "Export Documents",
  },
  {
    type: "cta",
    label: "Call To Action",
  },
  {
    type: "faq",
    label: "FAQ",
  },
] as const;

function createSection(
  type: LandingPageSection["type"]
): LandingPageSection {
  switch (type) {
    case "hero":
      return {
        type: "hero",
        heading: "",
        subheading: "",
        primaryCtaText: "Request a Quote",
        secondaryCtaText: "Explore Products",
      };

    case "valueProposition":
      return {
        type: "valueProposition",
        heading: "",
        description: "",
        points: [""],
      };

    case "product":
      return {
        type: "product",
        heading: "",
        description: "",
        productName: "",
        origin: "",
        form: "",
        packaging: "",
        moq: "",
        applications: [""],
      };

    case "applications":
      return {
        type: "applications",
        heading: "",
        description: "",
        items: [
          {
            title: "",
            description: "",
          },
        ],
      };

    case "whyRootym":
      return {
        type: "whyRootym",
        heading: "",
        points: [
          {
            title: "",
            description: "",
          },
        ],
      };

    case "buyerFocus":
      return {
        type: "buyerFocus",
        heading: "",
        description: "",
        buyerTypes: [""],
      };

    case "packaging":
      return {
        type: "packaging",
        heading: "",
        description: "",
        options: [""],
      };

    case "exportDocuments":
      return {
        type: "exportDocuments",
        heading: "",
        description: "",
        documents: [""],
      };

    case "cta":
      return {
        type: "cta",
        heading: "",
        description: "",
        primaryCtaText: "Request a Quote",
        secondaryCtaText: "Contact ROOTYM",
      };

    case "faq":
      return {
        type: "faq",
        heading: "",
        items: [
          {
            question: "",
            answer: "",
          },
        ],
      };
  }
}

function getSectionLabel(
  type: LandingPageSection["type"]
) {
  return (
    SECTION_OPTIONS.find(
      (option) => option.type === type
    )?.label ?? type
  );
}

export default function StructuredLandingPageEditor({
  value,
  onChange,
}: StructuredLandingPageEditorProps) {
  const [selectedSectionType, setSelectedSectionType] =
    useState<LandingPageSection["type"]>("hero");

  function updateSection(
    index: number,
    section: LandingPageSection
  ) {
    const sections = [...value.sections];
    sections[index] = section;

    onChange({
      ...value,
      sections,
    });
  }

  function removeSection(index: number) {
    onChange({
      ...value,
      sections: value.sections.filter(
        (_, sectionIndex) =>
          sectionIndex !== index
      ),
    });
  }

  function moveSection(
    index: number,
    direction: "up" | "down"
  ) {
    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= value.sections.length
    ) {
      return;
    }

    const sections = [...value.sections];

    [
      sections[index],
      sections[targetIndex],
    ] = [
      sections[targetIndex],
      sections[index],
    ];

    onChange({
      ...value,
      sections,
    });
  }

  function addSection() {
    onChange({
      ...value,
      sections: [
        ...value.sections,
        createSection(selectedSectionType),
      ],
    });
  }

  return (
    <div className="space-y-6">
      <Card
        hover={false}
        className="p-6"
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Landing Page Sections
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Build the country landing page using
            reusable structured sections.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="sectionType">
              Add Section
            </Label>

            <select
              id="sectionType"
              value={selectedSectionType}
              onChange={(event) =>
                setSelectedSectionType(
                  event.target
                    .value as LandingPageSection["type"]
                )
              }
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20"
            >
              {SECTION_OPTIONS.map(
                (option) => (
                  <option
                    key={option.type}
                    value={option.type}
                  >
                    {option.label}
                  </option>
                )
              )}
            </select>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addSection}
          >
            Add Section
          </Button>
        </div>
      </Card>

      {value.sections.length === 0 && (
        <Card
          hover={false}
          className="p-8 text-center"
        >
          <p className="text-sm text-gray-500">
            No sections added yet. Choose a section
            type above and click Add Section.
          </p>
        </Card>
      )}

      {value.sections.map(
        (section, index) => (
          <SectionEditor
            key={`${section.type}-${index}`}
            section={section}
            index={index}
            total={value.sections.length}
            onChange={(nextSection) =>
              updateSection(index, nextSection)
            }
            onRemove={() =>
              removeSection(index)
            }
            onMoveUp={() =>
              moveSection(index, "up")
            }
            onMoveDown={() =>
              moveSection(index, "down")
            }
          />
        )
      )}
    </div>
  );
}

type SectionEditorProps = {
  section: LandingPageSection;
  index: number;
  total: number;
  onChange: (
    section: LandingPageSection
  ) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

function SectionEditor({
  section,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: SectionEditorProps) {
  return (
    <Card
      hover={false}
      className="p-6"
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Section {index + 1}
          </p>

          <h3 className="mt-1 text-lg font-semibold text-gray-900">
            {getSectionLabel(section.type)}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={index === 0}
            onClick={onMoveUp}
          >
            ↑
          </Button>

          <Button
            type="button"
            variant="outline"
            disabled={index === total - 1}
            onClick={onMoveDown}
          >
            ↓
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onRemove}
          >
            Remove
          </Button>
        </div>
      </div>

      {section.type === "hero" && (
        <HeroEditor
          section={section}
          onChange={onChange}
        />
      )}

      {section.type === "valueProposition" && (
        <ValuePropositionEditor
          section={section}
          onChange={onChange}
        />
      )}

      {section.type === "product" && (
        <ProductEditor
          section={section}
          onChange={onChange}
        />
      )}

      {section.type === "applications" && (
        <ApplicationsEditor
          section={section}
          onChange={onChange}
        />
      )}

      {section.type === "whyRootym" && (
        <WhyRootymEditor
          section={section}
          onChange={onChange}
        />
      )}

      {section.type === "buyerFocus" && (
        <BuyerFocusEditor
          section={section}
          onChange={onChange}
        />
      )}

      {section.type === "packaging" && (
        <PackagingEditor
          section={section}
          onChange={onChange}
        />
      )}

      {section.type === "exportDocuments" && (
        <ExportDocumentsEditor
          section={section}
          onChange={onChange}
        />
      )}

      {section.type === "cta" && (
        <CtaEditor
          section={section}
          onChange={onChange}
        />
      )}

      {section.type === "faq" && (
        <FaqEditor
          section={section}
          onChange={onChange}
        />
      )}
    </Card>
  );
}

function HeroEditor({
  section,
  onChange,
}: {
  section: Extract<
    LandingPageSection,
    { type: "hero" }
  >;
  onChange: (
    section: LandingPageSection
  ) => void;
}) {
  return (
    <div className="grid gap-5">
      <Field
        label="Heading"
        value={section.heading}
        onChange={(value) =>
          onChange({
            ...section,
            heading: value,
          })
        }
      />

      <TextareaField
        label="Subheading"
        value={section.subheading}
        onChange={(value) =>
          onChange({
            ...section,
            subheading: value,
          })
        }
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Primary CTA"
          value={section.primaryCtaText}
          onChange={(value) =>
            onChange({
              ...section,
              primaryCtaText: value,
            })
          }
        />

        <Field
          label="Secondary CTA"
          value={section.secondaryCtaText}
          onChange={(value) =>
            onChange({
              ...section,
              secondaryCtaText: value,
            })
          }
        />
      </div>
    </div>
  );
}

function ValuePropositionEditor({
  section,
  onChange,
}: {
  section: Extract<
    LandingPageSection,
    { type: "valueProposition" }
  >;
  onChange: (
    section: LandingPageSection
  ) => void;
}) {
  return (
    <div className="space-y-5">
      <Field
        label="Heading"
        value={section.heading}
        onChange={(value) =>
          onChange({
            ...section,
            heading: value,
          })
        }
      />

      <TextareaField
        label="Description"
        value={section.description}
        onChange={(value) =>
          onChange({
            ...section,
            description: value,
          })
        }
      />

      <StringListEditor
        label="Value Points"
        items={section.points}
        onChange={(points) =>
          onChange({
            ...section,
            points,
          })
        }
      />
    </div>
  );
}

function ProductEditor({
  section,
  onChange,
}: {
  section: Extract<
    LandingPageSection,
    { type: "product" }
  >;
  onChange: (
    section: LandingPageSection
  ) => void;
}) {
  return (
    <div className="space-y-5">
      <Field
        label="Heading"
        value={section.heading}
        onChange={(value) =>
          onChange({
            ...section,
            heading: value,
          })
        }
      />

      <TextareaField
        label="Description"
        value={section.description}
        onChange={(value) =>
          onChange({
            ...section,
            description: value,
          })
        }
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Product Name"
          value={section.productName}
          onChange={(value) =>
            onChange({
              ...section,
              productName: value,
            })
          }
        />

        <Field
          label="Origin"
          value={section.origin}
          onChange={(value) =>
            onChange({
              ...section,
              origin: value,
            })
          }
        />

        <Field
          label="Form"
          value={section.form}
          onChange={(value) =>
            onChange({
              ...section,
              form: value,
            })
          }
        />

        <Field
          label="Packaging"
          value={section.packaging}
          onChange={(value) =>
            onChange({
              ...section,
              packaging: value,
            })
          }
        />

        <Field
          label="MOQ"
          value={section.moq}
          onChange={(value) =>
            onChange({
              ...section,
              moq: value,
            })
          }
        />
      </div>

      <StringListEditor
        label="Applications"
        items={section.applications}
        onChange={(applications) =>
          onChange({
            ...section,
            applications,
          })
        }
      />
    </div>
  );
}

function ApplicationsEditor({
  section,
  onChange,
}: {
  section: Extract<
    LandingPageSection,
    { type: "applications" }
  >;
  onChange: (
    section: LandingPageSection
  ) => void;
}) {
  return (
    <div className="space-y-5">
      <Field
        label="Heading"
        value={section.heading}
        onChange={(value) =>
          onChange({
            ...section,
            heading: value,
          })
        }
      />

      <TextareaField
        label="Description"
        value={section.description}
        onChange={(value) =>
          onChange({
            ...section,
            description: value,
          })
        }
      />

      <ObjectListEditor
        label="Application Items"
        items={section.items}
        onChange={(items) =>
          onChange({
            ...section,
            items,
          })
        }
      />
    </div>
  );
}

function WhyRootymEditor({
  section,
  onChange,
}: {
  section: Extract<
    LandingPageSection,
    { type: "whyRootym" }
  >;
  onChange: (
    section: LandingPageSection
  ) => void;
}) {
  return (
    <div className="space-y-5">
      <Field
        label="Heading"
        value={section.heading}
        onChange={(value) =>
          onChange({
            ...section,
            heading: value,
          })
        }
      />

      <ObjectListEditor
        label="Why ROOTYM Points"
        items={section.points}
        onChange={(points) =>
          onChange({
            ...section,
            points,
          })
        }
      />
    </div>
  );
}

function BuyerFocusEditor({
  section,
  onChange,
}: {
  section: Extract<
    LandingPageSection,
    { type: "buyerFocus" }
  >;
  onChange: (
    section: LandingPageSection
  ) => void;
}) {
  return (
    <div className="space-y-5">
      <Field
        label="Heading"
        value={section.heading}
        onChange={(value) =>
          onChange({
            ...section,
            heading: value,
          })
        }
      />

      <TextareaField
        label="Description"
        value={section.description}
        onChange={(value) =>
          onChange({
            ...section,
            description: value,
          })
        }
      />

      <StringListEditor
        label="Buyer Types"
        items={section.buyerTypes}
        onChange={(buyerTypes) =>
          onChange({
            ...section,
            buyerTypes,
          })
        }
      />
    </div>
  );
}

function PackagingEditor({
  section,
  onChange,
}: {
  section: Extract<
    LandingPageSection,
    { type: "packaging" }
  >;
  onChange: (
    section: LandingPageSection
  ) => void;
}) {
  return (
    <div className="space-y-5">
      <Field
        label="Heading"
        value={section.heading}
        onChange={(value) =>
          onChange({
            ...section,
            heading: value,
          })
        }
      />

      <TextareaField
        label="Description"
        value={section.description}
        onChange={(value) =>
          onChange({
            ...section,
            description: value,
          })
        }
      />

      <StringListEditor
        label="Packaging Options"
        items={section.options}
        onChange={(options) =>
          onChange({
            ...section,
            options,
          })
        }
      />
    </div>
  );
}

function ExportDocumentsEditor({
  section,
  onChange,
}: {
  section: Extract<
    LandingPageSection,
    { type: "exportDocuments" }
  >;
  onChange: (
    section: LandingPageSection
  ) => void;
}) {
  return (
    <div className="space-y-5">
      <Field
        label="Heading"
        value={section.heading}
        onChange={(value) =>
          onChange({
            ...section,
            heading: value,
          })
        }
      />

      <TextareaField
        label="Description"
        value={section.description}
        onChange={(value) =>
          onChange({
            ...section,
            description: value,
          })
        }
      />

      <StringListEditor
        label="Export Documents"
        items={section.documents}
        onChange={(documents) =>
          onChange({
            ...section,
            documents,
          })
        }
      />
    </div>
  );
}

function CtaEditor({
  section,
  onChange,
}: {
  section: Extract<
    LandingPageSection,
    { type: "cta" }
  >;
  onChange: (
    section: LandingPageSection
  ) => void;
}) {
  return (
    <div className="space-y-5">
      <Field
        label="Heading"
        value={section.heading}
        onChange={(value) =>
          onChange({
            ...section,
            heading: value,
          })
        }
      />

      <TextareaField
        label="Description"
        value={section.description}
        onChange={(value) =>
          onChange({
            ...section,
            description: value,
          })
        }
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Primary CTA"
          value={section.primaryCtaText}
          onChange={(value) =>
            onChange({
              ...section,
              primaryCtaText: value,
            })
          }
        />

        <Field
          label="Secondary CTA"
          value={section.secondaryCtaText}
          onChange={(value) =>
            onChange({
              ...section,
              secondaryCtaText: value,
            })
          }
        />
      </div>
    </div>
  );
}

function FaqEditor({
  section,
  onChange,
}: {
  section: Extract<
    LandingPageSection,
    { type: "faq" }
  >;
  onChange: (
    section: LandingPageSection
  ) => void;
}) {
  return (
    <div className="space-y-5">
      <Field
        label="Heading"
        value={section.heading}
        onChange={(value) =>
          onChange({
            ...section,
            heading: value,
          })
        }
      />

      <FaqListEditor
        items={section.items}
        onChange={(items) =>
          onChange({
            ...section,
            items,
          })
        }
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <Textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={4}
      />
    </div>
  );
}

function StringListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  function updateItem(
    index: number,
    value: string
  ) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }

  function addItem() {
    onChange([...items, ""]);
  }

  function removeItem(index: number) {
    onChange(
      items.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  }

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      {items.map((item, index) => (
        <div
          key={index}
          className="flex gap-2"
        >
          <Input
            value={item}
            onChange={(event) =>
              updateItem(
                index,
                event.target.value
              )
            }
            placeholder={`${label} item ${index + 1}`}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              removeItem(index)
            }
            disabled={items.length === 1}
          >
            Remove
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addItem}
      >
        Add Item
      </Button>
    </div>
  );
}

function ObjectListEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: {
    title: string;
    description: string;
  }[];
  onChange: (
    items: {
      title: string;
      description: string;
    }[]
  ) => void;
}) {
  function updateItem(
    index: number,
    field: "title" | "description",
    value: string
  ) {
    const next = [...items];

    next[index] = {
      ...next[index],
      [field]: value,
    };

    onChange(next);
  }

  function addItem() {
    onChange([
      ...items,
      {
        title: "",
        description: "",
      },
    ]);
  }

  function removeItem(index: number) {
    onChange(
      items.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  }

  return (
    <div className="space-y-4">
      <Label>{label}</Label>

      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 p-4"
        >
          <div className="space-y-4">
            <Field
              label="Title"
              value={item.title}
              onChange={(value) =>
                updateItem(
                  index,
                  "title",
                  value
                )
              }
            />

            <TextareaField
              label="Description"
              value={item.description}
              onChange={(value) =>
                updateItem(
                  index,
                  "description",
                  value
                )
              }
            />

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                removeItem(index)
              }
              disabled={items.length === 1}
            >
              Remove Item
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addItem}
      >
        Add Item
      </Button>
    </div>
  );
}

function FaqListEditor({
  items,
  onChange,
}: {
  items: {
    question: string;
    answer: string;
  }[];
  onChange: (
    items: {
      question: string;
      answer: string;
    }[]
  ) => void;
}) {
  function updateItem(
    index: number,
    field: "question" | "answer",
    value: string
  ) {
    const next = [...items];

    next[index] = {
      ...next[index],
      [field]: value,
    };

    onChange(next);
  }

  function addItem() {
    onChange([
      ...items,
      {
        question: "",
        answer: "",
      },
    ]);
  }

  function removeItem(index: number) {
    onChange(
      items.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  }

  return (
    <div className="space-y-4">
      <Label>FAQ Items</Label>

      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-xl border border-gray-200 p-4"
        >
          <div className="space-y-4">
            <Field
              label="Question"
              value={item.question}
              onChange={(value) =>
                updateItem(
                  index,
                  "question",
                  value
                )
              }
            />

            <TextareaField
              label="Answer"
              value={item.answer}
              onChange={(value) =>
                updateItem(
                  index,
                  "answer",
                  value
                )
              }
            />

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                removeItem(index)
              }
              disabled={items.length === 1}
            >
              Remove FAQ
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addItem}
      >
        Add FAQ
      </Button>
    </div>
  );
}