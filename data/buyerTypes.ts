export interface BuyerType {
    id: number;
    name: string;
    description: string;
    icon: string;
  }
  
  export const buyerTypes: BuyerType[] = [
    {
      id: 1,
      name: "Importer",
      description: "Imports products for resale or distribution.",
      icon: "🌍",
    },
    {
      id: 2,
      name: "Distributor",
      description: "Distributes products within a regional market.",
      icon: "🚚",
    },
    {
      id: 3,
      name: "Wholesaler",
      description: "Purchases in bulk for resale.",
      icon: "📦",
    },
    {
      id: 4,
      name: "Retail Chain",
      description: "Supermarkets and retail stores.",
      icon: "🏬",
    },
    {
      id: 5,
      name: "Food Processor",
      description: "Uses products as manufacturing inputs.",
      icon: "🏭",
    },
    {
      id: 6,
      name: "Trader",
      description: "International commodity trader.",
      icon: "📈",
    },
    {
      id: 7,
      name: "Other",
      description: "Please specify during the inquiry.",
      icon: "✨",
    },
  ];