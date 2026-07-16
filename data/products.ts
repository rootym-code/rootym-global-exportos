export interface Product {
  id: number;
  name: string;
  slug: string;
  image: string;
  category: string;
  origin: string;
  packaging: string;
  availability: string;
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Fresh Mango",
    slug: "fresh-mango",
    image: "/products/mango/card.webp",
    category: "Fresh Fruits",
    origin: "India",
    packaging: "4kg • 5kg Cartons",
    availability: "Available",
    description:
      "Premium export-quality Indian mangoes sourced from trusted farms with excellent sweetness, freshness and international packaging standards.",
  },
  {
    id: 2,
    name: "Premium Onion",
    slug: "premium-onion",
    image: "/products/onion/card.webp",
    category: "Fresh Vegetables",
    origin: "Nashik, India",
    packaging: "5kg • 10kg • 25kg",
    availability: "Available",
    description:
      "High-quality Nashik onions suitable for global export with excellent shelf life, uniform size and export-grade packaging.",
  },
  {
    id: 3,
    name: "Fresh Potato",
    slug: "fresh-potato",
    image: "/products/potato/card.webp",
    category: "Fresh Vegetables",
    origin: "India",
    packaging: "10kg • 25kg Bags",
    availability: "Available",
    description:
      "Fresh Indian potatoes carefully selected for export with consistent quality, long storage life and multiple packaging options.",
  },
];