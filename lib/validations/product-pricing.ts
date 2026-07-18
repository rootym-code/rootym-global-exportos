import { z } from "zod";

/**
 * ============================================================
 * Product Pricing Validation
 * ROOTYM Sprint 8
 * ============================================================
 */

export const pricingTypeSchema = z.enum([
  "FIXED",
  "MARKET",
]);

export const currencySchema = z
  .string()
  .trim()
  .length(3, "Currency must be a valid ISO code.")
  .transform((value) => value.toUpperCase());

const productPricingBaseSchema = z.object({
  productId: z
    .string()
    .trim()
    .min(1, "Product is required."),

  pricingType: pricingTypeSchema.default("FIXED"),

  currency: currencySchema,

  price: z.coerce
    .number()
    .positive("Price must be greater than zero."),

  validFrom: z
    .string()
    .datetime()
    .optional()
    .or(z.literal("")),

  validTo: z
    .string()
    .datetime()
    .optional()
    .or(z.literal("")),

  isActive: z.boolean().default(true),

  remarks: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal("")),
});

export const createProductPricingSchema =
  productPricingBaseSchema.superRefine(
    (data, ctx) => {
      if (
        data.validFrom &&
        data.validTo &&
        new Date(data.validTo) <
          new Date(data.validFrom)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["validTo"],
          message:
            "Valid To must be after Valid From.",
        });
      }
    }
  );

export const updateProductPricingSchema =
  productPricingBaseSchema
    .omit({
      productId: true,
    })
    .partial();

export type CreateProductPricingInput =
  z.infer<typeof createProductPricingSchema>;

export type UpdateProductPricingInput =
  z.infer<typeof updateProductPricingSchema>;