export type QuantityUnit = "KG" | "MT" | "Container";

export type PackagingType =
  | "Retail"
  | "Bulk"
  | "Customized";

export type BuyerType =
  | "Importer"
  | "Distributor"
  | "Wholesaler"
  | "Retail Chain"
  | "Food Processor"
  | "Trader"
  | "Other";

export type ShippingTerm =
  | "FOB"
  | "CIF"
  | "CFR"
  | "EXW"
  | "DAP"
  | "";

export type PaymentTerm =
  | "Advance"
  | "Letter of Credit"
  | "Negotiable"
  | "";

export interface ExportInquiry {
  // Product
  product: string;

  // Destination
  destinationCountry: string;
  destinationCity: string;
  destinationPort: string;

  // Quantity
  quantity: number | null;
  quantityUnit: QuantityUnit;

  // Packaging
  packaging: PackagingType | "";

  // Buyer
  buyerType: BuyerType | "";
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;

  // Shipping
  shippingTerm: ShippingTerm;

  // Payment
  paymentTerm: PaymentTerm;

  // Additional Requirements
  requirements: string;

  // Attachments (Phase 2)
  attachments: string[];
}