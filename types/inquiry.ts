export interface InquiryFormData {
    product: string;
    country: string;
    quantity: string;
    packaging: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    requirements: string;
  }
  
  export interface InquiryStepProps {
    formData: InquiryFormData;
    updateFormData: (
      field: keyof InquiryFormData,
      value: string
    ) => void;
  }