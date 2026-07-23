import { z } from "zod";

export const productStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

export const pricingTypeSchema = z.enum([
  "FIXED",
  "MARKET",
]);

export const createProductSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(2)
    .max(50),

  name: z
    .string()
    .trim()
    .min(2)
    .max(200),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(200),

  shortDescription: z
    .string()
    .trim()
    .max(300)
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  category: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal("")),

  origin: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal("")),

  hsCode: z
    .string()
    .trim()
    .max(30)
    .optional()
    .or(z.literal("")),

  defaultUnit: z
    .string()
    .trim()
    .min(1)
    .max(30),

  minOrderQty: z.coerce
    .number()
    .nonnegative()
    .optional(),

  maxOrderQty: z.coerce
    .number()
    .nonnegative()
    .optional(),

  status: productStatusSchema.default(
    "DRAFT"
  ),

  featuredImageId: z
  .string()
  .cuid()
  .nullable()
  .optional(),
  });

  export const updateProductSchema =
    createProductSchema.partial();
  
  export type CreateProductInput =
    z.infer<typeof createProductSchema>;
  
  export type UpdateProductInput =
    z.infer<typeof updateProductSchema>;
  
   