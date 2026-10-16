
import { ProductStatus, PricingType } from "@/lib/generated/prisma";
import { getProductById } from "@/lib/services/product.service";
import { getActiveProductPrice } from "@/lib/services/product-pricing.service";

export type ProductEligibilityReason =
  | "PRODUCT_NOT_FOUND"
  | "PRODUCT_NOT_PUBLISHED"
  | "ONLINE_PURCHASE_DISABLED"
  | "NO_VALID_ACTIVE_PRICE"
  | "QUOTATION_ONLY"
  | "INVALID_FIXED_PRICE"
  | "QUANTITY_BELOW_MINIMUM"
  | "QUANTITY_ABOVE_MAXIMUM";

export interface ProductPurchaseEligibility {
  eligible: boolean;
  reason: ProductEligibilityReason | null;
  message: string;
  productId: string;
  productName: string | null;
  pricingId: string | null;
  currency: string | null;
  unitPrice: number | null;
  unit: string | null;
  minimumOrderQuantity: number | null;
  maximumOrderQuantity: number | null;
}

export async function checkProductPurchaseEligibility(
  websiteId: string,
  productId: string,
  requestedQuantity?: number,
): Promise<ProductPurchaseEligibility> {
  const product = await getProductById(websiteId, productId);

  const result = (
    eligible: boolean,
    reason: ProductEligibilityReason | null,
    message: string,
    details: Partial<ProductPurchaseEligibility> = {},
  ): ProductPurchaseEligibility => ({
    eligible,
    reason,
    message,
    productId,
    productName: product?.name ?? null,
    pricingId: null,
    currency: null,
    unitPrice: null,
    unit: product?.defaultUnit ?? null,
    minimumOrderQuantity: product?.minOrderQty != null ? Number(product.minOrderQty) : null,
    maximumOrderQuantity: product?.maxOrderQty != null ? Number(product.maxOrderQty) : null,
    ...details,
  });

  if (!product) {
    return result(false, "PRODUCT_NOT_FOUND", "Product was not found for this website.");
  }

  if (product.status !== ProductStatus.PUBLISHED) {
    return result(false, "PRODUCT_NOT_PUBLISHED", "Only published products can be purchased.");
  }

  if (!product.onlinePurchaseEnabled) {
    return result(false, "ONLINE_PURCHASE_DISABLED", "Online purchase is not enabled for this product.");
  }

  const pricing = await getActiveProductPrice(websiteId, productId);

  if (!pricing) {
    return result(false, "NO_VALID_ACTIVE_PRICE", "The product has no currently valid active price.");
  }

  if (pricing.pricingType !== PricingType.FIXED) {
    return result(false, "QUOTATION_ONLY", "This product requires a quotation and cannot be purchased online.");
  }

  if (pricing.price === null || Number(pricing.price) <= 0) {
    return result(false, "INVALID_FIXED_PRICE", "The product does not have a valid fixed price.");
  }

  const minimumOrderQuantity = product.minOrderQty != null ? Number(product.minOrderQty) : null;
  const maximumOrderQuantity = product.maxOrderQty != null ? Number(product.maxOrderQty) : null;

  if (
    requestedQuantity !== undefined &&
    (!Number.isFinite(requestedQuantity) || requestedQuantity <= 0)
  ) {
    return result(false, "QUANTITY_BELOW_MINIMUM", "Enter a valid positive quantity.");
  }

  if (
    requestedQuantity !== undefined &&
    minimumOrderQuantity !== null &&
    requestedQuantity < minimumOrderQuantity
  ) {
    return result(false, "QUANTITY_BELOW_MINIMUM", `Minimum order quantity is ${minimumOrderQuantity}.`);
  }

  if (
    requestedQuantity !== undefined &&
    maximumOrderQuantity !== null &&
    requestedQuantity > maximumOrderQuantity
  ) {
    return result(false, "QUANTITY_ABOVE_MAXIMUM", `Maximum order quantity is ${maximumOrderQuantity}.`);
  }

  return result(true, null, "Product is eligible for online purchase.", {
    pricingId: pricing.id,
    currency: pricing.currency,
    unitPrice: Number(pricing.price),
    minimumOrderQuantity,
    maximumOrderQuantity,
  });
}
