export interface Testimonial {
    id: number;
    name: string;
    designation: string;
    country: string;
    message: string;
  }
  
  export const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Global Food Importer",
      designation: "Fresh Produce Buyer",
      country: "United Arab Emirates",
      message:
        "ROOTYM demonstrates a professional approach to export documentation, communication and product sourcing. We look forward to exploring future business opportunities together.",
    },
    {
      id: 2,
      name: "International Distributor",
      designation: "Procurement Manager",
      country: "United Kingdom",
      message:
        "The team provides clear communication and focuses on quality, packaging and timely coordination throughout the export process.",
    },
    {
      id: 3,
      name: "Wholesale Food Buyer",
      designation: "Import & Supply Chain",
      country: "Germany",
      message:
        "Their commitment to transparency, quality assurance and reliable export practices gives confidence when building long-term sourcing partnerships.",
    },
  ];