import { z } from "zod";

/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Validates Website-specific Product Pricing data.
 *          Fixed pricing requires a price, while Market pricing
 *          may intentionally omit the price for Price-on-Request
 *          and latest-market-deal workflows.
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

const pricingDateSchema = z
  .string()
  .refine(
    (value) => {
      if (value === "") {
        return true;
      }

      const isDateOnly =
        /^\d{4}-\d{2}-\d{2}$/.test(value);

      if (isDateOnly) {
        const parsed = new Date(
          `${value}T00:00:00.000Z`
        );

        return !Number.isNaN(parsed.getTime());
      }

      return !Number.isNaN(Date.parse(value));
    },
    "Please enter a valid date."
  )
  .optional()
  .or(z.literal(""));

/**
 * Converts an empty HTML input value into undefined.
 *
 * This is important because:
 *
 * <input type="number">
 *
 * sends an empty value as "" rather than null/undefined.
 */
const optionalPriceSchema = z.preprocess(
  (value) => {
    if (
      value === "" ||
      value === null ||
      value === undefined
    ) {
      return undefined;
    }

    return value;
  },
  z.coerce
    .number()
    .positive("Price must be greater than zero.")
    .optional()
);

/**
 * ------------------------------------------------------------
 * Base Product Pricing Schema
 * ------------------------------------------------------------
 */
const productPricingBaseSchema = z.object({
  productId: z
    .string()
    .trim()
    .min(1, "Product is required."),

  pricingType:
    pricingTypeSchema.default("FIXED"),

  currency: currencySchema,

  /**
   * Price is optional at the base level.
   *
   * FIXED pricing is enforced below in superRefine().
   * MARKET pricing may intentionally have no price.
   */
  price: optionalPriceSchema,

  validFrom: pricingDateSchema,

  validTo: pricingDateSchema,

  isActive: z
    .boolean()
    .default(true),

  remarks: z
    .string()
    .trim()
    .max(
      500,
      "Remarks cannot exceed 500 characters."
    )
    .optional()
    .or(z.literal("")),
});

/**
 * ------------------------------------------------------------
 * Create Product Pricing
 * ------------------------------------------------------------
 */
export const createProductPricingSchema =
  productPricingBaseSchema.superRefine(
    (data, ctx) => {
      /**
       * Fixed pricing must always have an actual price.
       */
      if (
        data.pricingType === "FIXED" &&
        data.price === undefined
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["price"],
          message:
            "Price is required for Fixed pricing.",
        });
      }

      /**
       * Validity range check.
       */
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

/**
 * ------------------------------------------------------------
 * Update Product Pricing
 * ------------------------------------------------------------
 */
export const updateProductPricingSchema =
  productPricingBaseSchema
    .omit({
      productId: true,
    })
    .partial()
    .superRefine((data, ctx) => {
      /**
       * If the pricing type is explicitly changed to FIXED,
       * a price must be supplied.
       */
      if (
        data.pricingType === "FIXED" &&
        data.price === undefined
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["price"],
          message:
            "Price is required for Fixed pricing.",
        });
      }

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
    });

export type CreateProductPricingInput =
  z.infer<
    typeof createProductPricingSchema
  >;

export type UpdateProductPricingInput =
  z.infer<
    typeof updateProductPricingSchema
  >;