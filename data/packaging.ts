export interface PackagingOption {
    id: number;
    name: string;
    description: string;
    icon: string;
    suitableFor: string[];
  }
  
  export const packagingOptions: PackagingOption[] = [
    {
      id: 1,
      name: "Mesh Bag",
      description: "Breathable packaging for onions and potatoes.",
      icon: "🧅",
      suitableFor: ["premium-onion", "fresh-potato"],
    },
    {
      id: 2,
      name: "Corrugated Carton",
      description: "Strong export cartons for fresh fruits.",
      icon: "🥭",
      suitableFor: ["fresh-mango"],
    },
    {
      id: 3,
      name: "PP Bag",
      description: "Heavy-duty polypropylene bags for bulk shipments.",
      icon: "📦",
      suitableFor: [
        "premium-onion",
        "fresh-potato",
        "fresh-mango",
      ],
    },
    {
      id: 4,
      name: "Retail Packaging",
      description: "Consumer-ready branded retail packs.",
      icon: "🛍️",
      suitableFor: [
        "fresh-mango",
        "premium-onion",
        "fresh-potato",
      ],
    },
    {
      id: 5,
      name: "Customized Packaging",
      description: "Packaging according to buyer specifications.",
      icon: "✨",
      suitableFor: [
        "fresh-mango",
        "premium-onion",
        "fresh-potato",
      ],
    },
  ];