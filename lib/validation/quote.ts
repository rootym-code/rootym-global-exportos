import { z } from "zod";

/**
 * ============================================================
 * ROOTYM Quote Validation
 * Sprint 8
 * ============================================================
 */

export const quoteStatusSchema = z.enum([
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
  "CANCELLED",
]);

export const quoteItemSchema = z.object({
  productId: z
    .string()
    .trim()
    .min(1, "Product is required."),

  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal("")),

  quantity: z.coerce
    .number()
    .positive("Quantity must be greater than zero."),

  unit: z
    .string()
    .trim()
    .min(1, "Unit is required.")
    .max(30),

  unitPrice: z.coerce
    .number()
    .nonnegative("Unit price cannot be negative."),

  lineTotal: z.coerce
    .number()
    .nonnegative("Line total cannot be negative."),
});

const quoteBaseSchema = z.object({
  inquiryId: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  companyName: z
    .string()
    .trim()
    .min(2)
    .max(200),

  contactPerson: z
    .string()
    .trim()
    .min(2)
    .max(200),

  email: z
    .string()
    .trim()
    .email("Invalid email address."),

  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .or(z.literal("")),

  country: z
    .string()
    .trim()
    .min(2)
    .max(100),

  currency: z
    .string()
    .trim()
    .length(3)
    .transform((value) =>
      value.toUpperCase()
    ),

  subtotal: z.coerce
    .number()
    .nonnegative(),

  discount: z.coerce
    .number()
    .nonnegative()
    .default(0),

  freight: z.coerce
    .number()
    .nonnegative()
    .default(0),

  insurance: z.coerce
    .number()
    .nonnegative()
    .default(0),

  tax: z.coerce
    .number()
    .nonnegative()
    .default(0),

  grandTotal: z.coerce
    .number()
    .nonnegative(),

  validityDays: z.coerce
    .number()
    .int()
    .min(1)
    .max(365)
    .default(15),

  status: quoteStatusSchema.default(
    "DRAFT"
  ),

  notes: z
    .string()
    .trim()
    .max(5000)
    .optional()
    .or(z.literal("")),

  items: z
    .array(quoteItemSchema)
    .min(
      1,
      "At least one quote item is required."
    ),
});

export const createQuoteSchema =
  quoteBaseSchema.superRefine(
    (data, ctx) => {
      const calculatedSubtotal =
        data.items.reduce(
          (sum, item) =>
            sum + item.lineTotal,
          0
        );

      if (
        Math.abs(
          calculatedSubtotal -
            data.subtotal
        ) > 0.01
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["subtotal"],
          message:
            "Subtotal does not match quote items.",
        });
      }

      const expectedGrandTotal =
        data.subtotal -
        data.discount +
        data.freight +
        data.insurance +
        data.tax;

      if (
        Math.abs(
          expectedGrandTotal -
            data.grandTotal
        ) > 0.01
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["grandTotal"],
          message:
            "Grand total calculation is incorrect.",
        });
      }

      data.items.forEach(
        (item, index) => {
          const expectedLineTotal =
            item.quantity *
            item.unitPrice;

          if (
            Math.abs(
              expectedLineTotal -
                item.lineTotal
            ) > 0.01
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [
                "items",
                index,
                "lineTotal",
              ],
              message:
                "Line total should equal Quantity × Unit Price.",
            });
          }
        }
      );
    }
  );

export const updateQuoteSchema =
  quoteBaseSchema
    .omit({
      items: true,
    })
    .partial()
    .extend({
      items: z
        .array(quoteItemSchema)
        .optional(),
    });

export type QuoteItemInput =
  z.infer<typeof quoteItemSchema>;

export type CreateQuoteInput =
  z.infer<typeof createQuoteSchema>;

export type UpdateQuoteInput =
  z.infer<typeof updateQuoteSchema>;