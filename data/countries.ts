export interface Country {
    id: number;
    name: string;
    isoCode: string;
    flag: string;
    focusMarket: boolean;
    popularPorts: string[];
  }
  
  export const countries: Country[] = [
    {
      id: 1,
      name: "United Arab Emirates",
      isoCode: "AE",
      flag: "🇦🇪",
      focusMarket: true,
      popularPorts: ["Jebel Ali", "Abu Dhabi"],
    },
    {
      id: 2,
      name: "United Kingdom",
      isoCode: "GB",
      flag: "🇬🇧",
      focusMarket: true,
      popularPorts: ["London", "Liverpool"],
    },
    {
      id: 3,
      name: "Germany",
      isoCode: "DE",
      flag: "🇩🇪",
      focusMarket: true,
      popularPorts: ["Hamburg", "Bremerhaven"],
    },
    {
      id: 4,
      name: "United States",
      isoCode: "US",
      flag: "🇺🇸",
      focusMarket: true,
      popularPorts: ["New York", "Houston"],
    },
    {
      id: 5,
      name: "Sri Lanka",
      isoCode: "LK",
      flag: "🇱🇰",
      focusMarket: true,
      popularPorts: ["Colombo"],
    },
    {
      id: 6,
      name: "Other Country",
      isoCode: "OTHER",
      flag: "🌍",
      focusMarket: false,
      popularPorts: [],
    },
  ];