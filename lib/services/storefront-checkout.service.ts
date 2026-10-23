import { createHash, randomUUID } from "node:crypto";

import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { checkProductPurchaseEligibility } from "@/lib/services/product-eligibility.service";
import { getProductById } from "@/lib/services/product.service";
import {
  calculateShipmentMeasurements,
  prepareDelhiveryQuote,
} from "@/lib/services/delhivery-shipping.service";

export type CheckoutItemInput = {
  productId: string;
  quantity: number;
};

export type CheckoutCustomerInput = {
  name: string;
  email: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
};

export type CreateCheckoutInput = {
  websiteSlug: string;
  checkoutRequestId: string;
  items: CheckoutItemInput[];
  customer: CheckoutCustomerInput;
};

export class CheckoutError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number = 400,
  ) {
    super(message);
    this.name = "CheckoutError";
  }
}

const MAX_ITEMS = 50;
const MAX_QUANTITY = 1_000_000;

const storeOrderResponseSelect = {
    id: true,
    orderNumber: true,
    status: true,
    paymentStatus: true,
    currency: true,
    subtotal: true,
    shippingAmount: true,
    taxAmount: true,
    discountAmount: true,
    totalAmount: true,
    createdAt: true,
    items: {
      select: {
        productName: true,
        productSku: true,
        unit: true,
        quantity: true,
        unitPrice: true,
        lineTotal: true,
      },
    },
  } satisfies Prisma.StoreOrderSelect;

function requiredText(
  value: unknown,
  label: string,
  maxLength = 200,
): string {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.trim().length > maxLength
  ) {
    throw new CheckoutError(
      `${label} is required and must not exceed ${maxLength} characters.`,
      "INVALID_CHECKOUT_CUSTOMER",
    );
  }

  return value.trim();
}

function optionalText(
  value: unknown,
  label: string,
  maxLength = 200,
): string | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return requiredText(value, label, maxLength);
}

function validateCustomer(value: unknown): CheckoutCustomerInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new CheckoutError(
      "Valid customer and shipping details are required.",
      "INVALID_CHECKOUT_CUSTOMER",
    );
  }

  const input = value as Record<string, unknown>;
  const name = requiredText(input.name, "Customer name", 150);
  const email = requiredText(input.email, "Email", 254).toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new CheckoutError("Enter a valid email address.", "INVALID_EMAIL");
  }

  const phone = optionalText(input.phone, "Phone", 30);

  if (phone && !/^[+()\d .-]{7,30}$/.test(phone)) {
    throw new CheckoutError("Enter a valid phone number.", "INVALID_PHONE");
  }

const country = requiredText(input.country, "Country", 100);
  const postalCode = requiredText(input.postalCode, "Postal code", 30);

  if (!/^india$/i.test(country)) {
    throw new CheckoutError(
      "Shipping is currently available only within India.",
      "UNSUPPORTED_SHIPPING_COUNTRY",
      400,
    );
  }

  if (!/^\d{6}$/.test(postalCode)) {
    throw new CheckoutError(
      "Enter a valid six-digit Indian PIN code.",
      "INVALID_SHIPPING_PIN",
      400,
    );
  }

  return {
    name,
    email,
    ...(phone ? { phone } : {}),

    address1: requiredText(input.address1, "Address", 200),
    ...(optionalText(input.address2, "Address line 2", 200)
      ? { address2: optionalText(input.address2, "Address line 2", 200) }
      : {}),
    city: requiredText(input.city, "City", 100),
    ...(optionalText(input.state, "State", 100)
      ? { state: optionalText(input.state, "State", 100) }
      : {}),
      postalCode,
      country: "India",
  };
}

function validateItems(value: unknown): CheckoutItemInput[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_ITEMS) {
    throw new CheckoutError(
      `Cart must contain between 1 and ${MAX_ITEMS} items.`,
      "INVALID_CART",
    );
  }

  const seen = new Set<string>();

  return value.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new CheckoutError("Invalid cart item.", "INVALID_CART_ITEM");
    }

    const item = entry as Record<string, unknown>;
    const productId = requiredText(item.productId, "Product ID", 100);
    const quantity = item.quantity;

    if (seen.has(productId)) {
      throw new CheckoutError(
        "Each product must appear only once in the cart.",
        "DUPLICATE_CART_PRODUCT",
      );
    }
    seen.add(productId);

    if (
      typeof quantity !== "number" ||
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      quantity > MAX_QUANTITY ||
      Math.round(quantity * 1000) !== quantity * 1000
    ) {
      throw new CheckoutError(
        "Quantity must be positive and may have at most three decimal places.",
        "INVALID_QUANTITY",
      );
    }

    return { productId, quantity };
  });
}

export async function validateCheckout(input: CreateCheckoutInput) {
  const websiteSlug = requiredText(input.websiteSlug, "Website slug", 200);

  const website = await prisma.website.findFirst({
    where: { slug: websiteSlug, isActive: true },
    select: {
      id: true,
      slug: true,
      storeSettings: true,
      storePayment: {
        select: {
          provider: true,
          publicKeyId: true,
          encryptedKeySecret: true,
          encryptedWebhookSecret: true,
          paymentsEnabled: true,
          verifiedAt: true,
        },
      },
    },
  });

  if (!website) {
    throw new CheckoutError(
      "This store is unavailable.",
      "STORE_NOT_FOUND",
      404,
    );
  }

  const settings = website.storeSettings;

  if (!settings?.storeEnabled) {
    throw new CheckoutError(
      "Online sales are not enabled for this store.",
      "STORE_DISABLED",
      409,
    );
  }

  if (!settings.cartEnabled) {
    throw new CheckoutError(
      "Online cart checkout is not enabled.",
      "CART_DISABLED",
      409,
    );
  }

  const payment = website.storePayment;
  const items = validateItems(input.items);
  
  if (items.length !== 1) {
    throw new CheckoutError(
      "Each shipment must contain only one distinct product. Adjust your cart to continue.",
      "SINGLE_PRODUCT_SHIPMENT_REQUIRED",
      409,
    );
  }
  
  const customer = validateCustomer(input.customer);

  const eligibleItems: Array<{
    productId: string;
    productName: string;
    productSku: string;
    unit: string;
    pricingId: string;
    quantity: Prisma.Decimal;
    unitPrice: Prisma.Decimal;
    lineTotal: Prisma.Decimal;
    storeGstRate: Prisma.Decimal | null;
  }> = [];
  
  let shipmentMeasurements:
    | ReturnType<typeof calculateShipmentMeasurements>
    | null = null;
  
  let subtotal = new Prisma.Decimal(0);

  for (const item of items) {
    const eligibility = await checkProductPurchaseEligibility(
      website.id,
      item.productId,
      item.quantity,
    );

    if (!eligibility.eligible) {
      throw new CheckoutError(
        eligibility.message,
        eligibility.reason ?? "PRODUCT_NOT_ELIGIBLE",
        409,
      );
    }

    if (
      !eligibility.pricingId ||
      eligibility.unitPrice === null ||
      !eligibility.currency ||
      !eligibility.unit
    ) {
      throw new CheckoutError(
        "Product pricing could not be verified.",
        "PRODUCT_PRICE_UNAVAILABLE",
        409,
      );
    }

    if (eligibility.currency.toUpperCase() !== settings.defaultCurrency.toUpperCase()) {
      throw new CheckoutError(
        `Product "${eligibility.productName}" is priced in ${eligibility.currency}, but the store currency is ${settings.defaultCurrency}.`,
        "CURRENCY_MISMATCH",
        409,
      );
    }

    const product = await getProductById(website.id, item.productId);

    if (!product) {
      throw new CheckoutError(
        "A cart product is no longer available.",
        "PRODUCT_NOT_FOUND",
        409,
      );
    }

    if (
      product.weightKg == null ||
      product.lengthCm == null ||
      product.widthCm == null ||
      product.heightCm == null
    ) {
      throw new CheckoutError(
        `Shipping measurements are missing for "${product.name}". Please contact the store before placing this order.`,
        "PRODUCT_SHIPPING_MEASUREMENTS_UNAVAILABLE",
        409,
      );
    }
    
    const weightKg = Number(product.weightKg);
    const lengthCm = Number(product.lengthCm);
    const widthCm = Number(product.widthCm);
    const heightCm = Number(product.heightCm);
    
    if (
      ![weightKg, lengthCm, widthCm, heightCm].every(
        (value) => Number.isFinite(value) && value > 0,
      )
    ) {
      throw new CheckoutError(
        `Shipping measurements are invalid for "${product.name}".`,
        "PRODUCT_SHIPPING_MEASUREMENTS_INVALID",
        409,
      );
    }
    
    shipmentMeasurements = calculateShipmentMeasurements({
      weightKg,
      lengthCm,
      widthCm,
      heightCm,
      quantity: item.quantity,
    });

    const quantity = new Prisma.Decimal(String(item.quantity));
    const unitPrice = new Prisma.Decimal(String(eligibility.unitPrice));
    const lineTotal = unitPrice.mul(quantity).toDecimalPlaces(
      2,
      Prisma.Decimal.ROUND_HALF_UP,
    );

    subtotal = subtotal.plus(lineTotal);

    eligibleItems.push({
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      unit: eligibility.unit,
      pricingId: eligibility.pricingId,
      quantity,
      unitPrice,
      lineTotal,
      storeGstRate:
      product.storeGstRate == null
        ? null
        : new Prisma.Decimal(product.storeGstRate.toString()),
    });
  }

  return {
    website,
    settings,
    customer,
    items: eligibleItems,
    shipmentMeasurements,
    subtotal: subtotal.toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP),
    taxRate: eligibleItems[0]?.storeGstRate ?? null,
  };
}

function createCheckoutRequestHash(
  validated: Awaited<ReturnType<typeof validateCheckout>>,
): string {
  const canonicalPayload = {
    websiteId: validated.website.id,
    currency: validated.settings.defaultCurrency.toUpperCase(),
    customer: {
      name: validated.customer.name,
      email: validated.customer.email.toLowerCase(),
      phone: validated.customer.phone ?? null,
      address1: validated.customer.address1,
      address2: validated.customer.address2 ?? null,
      city: validated.customer.city,
      state: validated.customer.state ?? null,
      postalCode: validated.customer.postalCode,
      country: validated.customer.country,
    },
    items: [...validated.items]
      .sort((a, b) => a.productId.localeCompare(b.productId))
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity.toString(),
        pricingId: item.pricingId,
        unitPrice: item.unitPrice.toString(),
        currency: validated.settings.defaultCurrency.toUpperCase(),
      })),
  };

  return createHash("sha256")
    .update(JSON.stringify(canonicalPayload))
    .digest("hex");
}

function createCheckoutRequestFingerprint(
  websiteId: string,
  input: CreateCheckoutInput,
): string {
  const customer = validateCustomer(input.customer);
  const items = validateItems(input.items);

  const canonicalPayload = {
    websiteId,
    customer: {
      name: requiredText(customer.name, "Customer name", 150),
      email: customer.email.toLowerCase(),
      phone: customer.phone ?? null,
      address1: customer.address1,
      address2: customer.address2 ?? null,
      city: customer.city,
      state: customer.state ?? null,
      postalCode: customer.postalCode,
      country: customer.country,
    },
    items: [...items]
      .sort((a, b) => a.productId.localeCompare(b.productId))
      .map((item) => ({
        productId: item.productId,
        quantity: String(item.quantity),
      })),
  };

  return createHash("sha256")
    .update(JSON.stringify(canonicalPayload))
    .digest("hex");
}

export async function createStoreOrder(input: CreateCheckoutInput) {
  const checkoutRequestId = requiredText(
    input.checkoutRequestId,
    "Checkout request ID",
    100,
  );

  if (!/^[A-Za-z0-9_-]{8,100}$/.test(checkoutRequestId)) {
    throw new CheckoutError(
      "Checkout request ID must be 8â€“100 letters, numbers, underscores or hyphens.",
      "INVALID_CHECKOUT_REQUEST_ID",
    );
  }

const websiteSlug = requiredText(input.websiteSlug, "Website slug", 200);

  const website = await prisma.website.findFirst({
    where: { slug: websiteSlug },
    select: { id: true },
  });

  if (!website) {
    throw new CheckoutError(
      "This store is unavailable.",
      "STORE_NOT_FOUND",
      404,
    );
  }

  const checkoutRequestFingerprint = createCheckoutRequestFingerprint(
    website.id,
    input,
  );

  const existing = await prisma.storeOrder.findUnique({
    where: {
      websiteId_checkoutRequestId: {
        websiteId: website.id,
        checkoutRequestId,
      },
    },
    select: {
      ...storeOrderResponseSelect,
      checkoutRequestHash: true,
      checkoutRequestFingerprint: true,
    },
  });

  if (existing) {
    if (existing.checkoutRequestFingerprint) {
      if (
        existing.checkoutRequestFingerprint !== checkoutRequestFingerprint
      ) {
        throw new CheckoutError(
          "This checkout request ID was already used for different order details. Start a new checkout attempt.",
          "CHECKOUT_REQUEST_REUSED",
          409,
        );
      }

      const {
        checkoutRequestHash: _checkoutRequestHash,
        checkoutRequestFingerprint: _checkoutRequestFingerprint,
        ...existingResponse
      } = existing;
      
      return existingResponse;
    }

    // Legacy orders do not have a fingerprint. Verify them using
    // the original price-sensitive hash before returning them.
    const legacyValidated = await validateCheckout(input);
    const legacyHash = createCheckoutRequestHash(legacyValidated);

    if (
      !existing.checkoutRequestHash ||
      existing.checkoutRequestHash !== legacyHash
    ) {
      throw new CheckoutError(
        "This checkout request ID was already used for different order details. Start a new checkout attempt.",
        "CHECKOUT_REQUEST_REUSED",
        409,
      );
    }

    const {
      checkoutRequestHash: _checkoutRequestHash,
      checkoutRequestFingerprint: _checkoutRequestFingerprint,
      ...existingResponse
    } = existing;
    
    return existingResponse;
  }

  const validated = await validateCheckout(input);

  const checkoutRequestHash = createCheckoutRequestHash(validated);

if (validated.settings.defaultCurrency.trim().toUpperCase() !== "INR") {
    throw new CheckoutError(
      "Delhivery shipping is currently supported only for INR orders.",
      "UNSUPPORTED_SHIPPING_CURRENCY",
      400,
    );
  }

  const originPin = process.env.DELHIVERY_PICKUP_PIN?.trim();

  if (!originPin || !/^\d{6}$/.test(originPin)) {
    throw new CheckoutError(
      "Shipping is temporarily unavailable because the pickup location is not configured correctly.",
      "SHIPPING_ORIGIN_NOT_CONFIGURED",
      503,
    );
  }

  if (!validated.shipmentMeasurements) {
    throw new CheckoutError(
      "Shipping measurements could not be calculated for this order.",
      "SHIPPING_MEASUREMENTS_UNAVAILABLE",
      409,
    );
  }

  let shippingQuote;

  try {
    shippingQuote = await prepareDelhiveryQuote({
      currency: validated.settings.defaultCurrency,
      originPin,
      destinationPin: validated.customer.postalCode,
      measurements: validated.shipmentMeasurements,
    });
  } catch {
    throw new CheckoutError(
      "We could not calculate shipping for this address. Please try again later.",
      "SHIPPING_QUOTE_UNAVAILABLE",
      503,
    );
  }

  const zero = new Prisma.Decimal(0);

  const shippingAmount = new Prisma.Decimal(
    shippingQuote.amount,
  ).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
  
  // GST applies to the product subtotal only, excluding shipping.
  const taxAmount =
    validated.taxRate == null
      ? zero
      : validated.subtotal
          .mul(validated.taxRate)
          .div(100)
          .toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
  
  const totalAmount = validated.subtotal
    .plus(shippingAmount)
    .plus(taxAmount);

const orderNumber = `RTM-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${randomUUID()
    .replace(/-/g, "")
    .slice(0, 10)
    .toUpperCase()}`;

    try {
  const order = await prisma.storeOrder.create({
    data: {
      websiteId: validated.website.id,
      orderNumber,
      checkoutRequestId,
      checkoutRequestHash,
      checkoutRequestFingerprint,
      currency: validated.settings.defaultCurrency,
      subtotal: validated.subtotal,
      shippingAmount,
      shippingRuleName: "Delhivery",
      discountAmount: zero,
      taxAmount,
      totalAmount,
      
metadata: {
  shipping: {
    provider: shippingQuote.provider,
    currency: "INR",
    amount: shippingAmount.toString(),
    chargedWeightGrams: shippingQuote.chargedWeightGrams,
    zone: shippingQuote.zone,
    status: shippingQuote.status,
    originPin,
    destinationPin: validated.customer.postalCode,
    quotedAt: new Date().toISOString(),
    measurements: {
      quantity: validated.shipmentMeasurements.quantity,
      totalActualWeightGrams:
        validated.shipmentMeasurements.totalActualWeightGrams,
      totalVolumeCm3:
        validated.shipmentMeasurements.totalVolumeCm3,
      equivalentParcelDimensionsCm:
        validated.shipmentMeasurements.equivalentParcelDimensionsCm,
    },
  },
},

      customerName: validated.customer.name,
      customerEmail: validated.customer.email,
      customerPhone: validated.customer.phone ?? null,
      shippingAddress1: validated.customer.address1,
      shippingAddress2: validated.customer.address2 ?? null,
      shippingCity: validated.customer.city,
      shippingState: validated.customer.state ?? null,
      shippingPostalCode: validated.customer.postalCode,
      shippingCountry: validated.customer.country,
      items: {
        create: validated.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productSku: item.productSku,
          unit: item.unit,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: item.lineTotal,
          pricingId: item.pricingId,
        })),
      },
    },
    select: storeOrderResponseSelect,
  });

  return order;

} catch (error) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {

const existingOrder = await prisma.storeOrder.findUnique({
      where: {
        websiteId_checkoutRequestId: {
          websiteId: validated.website.id,
          checkoutRequestId,
        },
      },
      select: {
        ...storeOrderResponseSelect,
        checkoutRequestHash: true,
        checkoutRequestFingerprint: true,
      },
    });

    // Recover only when the unique conflict was caused by this
    // checkout request ID. Otherwise, preserve the original error.

    if (existingOrder) {
      if (existingOrder.checkoutRequestFingerprint) {
        if (
          existingOrder.checkoutRequestFingerprint !==
          checkoutRequestFingerprint
        ) {
          throw new CheckoutError(
            "This checkout request ID was already used for different order details. Start a new checkout attempt.",
            "CHECKOUT_REQUEST_REUSED",
            409,
          );
        }
    
        const {
          checkoutRequestHash: _checkoutRequestHash,
          checkoutRequestFingerprint: _checkoutRequestFingerprint,
          ...existingResponse
        } = existingOrder;
        
        return existingResponse;
      }
    
      // Backward compatibility for orders created before fingerprints
      // were introduced.
      if (
        existingOrder.checkoutRequestHash &&
        existingOrder.checkoutRequestHash === checkoutRequestHash
      ) {
        const {
          checkoutRequestHash: _checkoutRequestHash,
          checkoutRequestFingerprint: _checkoutRequestFingerprint,
          ...existingResponse
        } = existingOrder;
        
        return existingResponse;
      }
    
      throw new CheckoutError(
        "This checkout request ID was already used for different order details. Start a new checkout attempt.",
        "CHECKOUT_REQUEST_REUSED",
        409,
      );
    }

}

  throw error;
}
}
