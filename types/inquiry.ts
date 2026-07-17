export type QuantityUnit = "KG" | "MT" | "Container";

export type BuyerType =
  | "Importer"
  | "Distributor"
  | "Wholesaler"
  | "Retail Chain"
  | "Food Processor"
  | "Trader"
  | "Others";

export type Incoterm =
  | "FOB"
  | "CIF"
  | "CFR"
  | "EXW"
  | "FCA"
  | "CPT"
  | "CIP"
  | "DAP"
  | "DPU"
  | "DDP"
  | "Not Sure";

export interface InquiryFormData {
  // Step 1 - Product
  product: string;

  // Step 2 - Destination
  country: string;

  // Step 3 - Quantity
  quantity: string;
  quantityUnit: QuantityUnit;

  // Step 4 - Packaging
  packaging: string;
  packagingInstructions: string;

  // Step 5 - Buyer Information
  companyName: string;
  buyerType: BuyerType | "";

  contactPerson: string;
  designation: string;

  email: string;
  phone: string;
  website: string;

  // Step 6 - Preferred Shipping Terms (Incoterms)
  preferredIncoterm: Incoterm | "";
  namedPlace: string;

  // Step 7 - Additional Requirements
  requirements: string;
}

export interface InquiryStepProps {
  formData: InquiryFormData;

  updateFormData: <K extends keyof InquiryFormData>(
    field: K,
    value: InquiryFormData[K]
  ) => void;
}