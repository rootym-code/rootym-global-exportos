export interface Product {
    id: number;
    name: string;
    slug: string;
    image: string;
    category: string;
    origin: string;
    packaging: string;
    availability: string;
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
    },
  ];