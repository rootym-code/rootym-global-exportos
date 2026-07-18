// ============================================================
// ROOTYM Motion Engine
// File: components/animations/globe.constants.ts
// ============================================================

export interface GlobeHub {
    id: string;
    name: string;
    country: string;
  
    /**
     * SVG Coordinates
     * ViewBox = 1000 x 1000
     */
    x: number;
    y: number;
  
    radius?: number;
  
    /**
     * Primary Export Hub
     */
    primary?: boolean;
  
    /**
     * Used later for TradeRoutes
     */
    connections: string[];
  }
  
  /* -------------------------------------------------------------------------- */
  /*                                  SVG                                       */
  /* -------------------------------------------------------------------------- */
  
  export const GLOBE_SIZE = 1000;
  export const GLOBE_RADIUS = 430;
  export const GLOBE_CENTER = 500;
  
  /* -------------------------------------------------------------------------- */
  /*                              Animation                                     */
  /* -------------------------------------------------------------------------- */
  
  export const GLOBE_ROTATION_DURATION = 80;
  
  export const GLOW_DURATION = 3.5;
  
  export const MARKER_PULSE_DURATION = 2.2;
  
  export const ORBIT_DURATION = 20;
  
  /* -------------------------------------------------------------------------- */
  /*                               Export Hubs                                  */
  /* -------------------------------------------------------------------------- */
  
  export const EXPORT_HUBS: GlobeHub[] = [
    {
      id: "india",
      name: "Mumbai",
      country: "India",
  
      x: 630,
      y: 430,
  
      primary: true,
      radius: 10,
  
      connections: [
        "uae",
        "uk",
        "germany",
        "usa",
        "singapore",
        "australia",
      ],
    },
  
    {
      id: "uae",
      name: "Dubai",
      country: "UAE",
  
      x: 585,
      y: 385,
  
      radius: 7,
  
      connections: ["india"],
    },
  
    {
      id: "uk",
      name: "London",
      country: "United Kingdom",
  
      x: 485,
      y: 245,
  
      radius: 7,
  
      connections: ["india"],
    },
  
    {
      id: "germany",
      name: "Hamburg",
      country: "Germany",
  
      x: 515,
      y: 265,
  
      radius: 7,
  
      connections: ["india"],
    },
  
    {
      id: "usa",
      name: "New York",
      country: "USA",
  
      x: 245,
      y: 300,
  
      radius: 7,
  
      connections: ["india"],
    },
  
    {
      id: "singapore",
      name: "Singapore",
  
      country: "Singapore",
  
      x: 690,
      y: 510,
  
      radius: 7,
  
      connections: ["india"],
    },
  
    {
      id: "australia",
      name: "Sydney",
  
      country: "Australia",
  
      x: 820,
      y: 710,
  
      radius: 7,
  
      connections: ["india"],
    },
  ];
  
  /* -------------------------------------------------------------------------- */
  /*                              Globe Grid                                    */
  /* -------------------------------------------------------------------------- */
  
  export const LATITUDE_LINES = [
    -75,
    -60,
    -45,
    -30,
    -15,
    0,
    15,
    30,
    45,
    60,
    75,
  ];
  
  export const LONGITUDE_LINES = [
    -180,
    -150,
    -120,
    -90,
    -60,
    -30,
    0,
    30,
    60,
    90,
    120,
    150,
    180,
  ];
  
  /* -------------------------------------------------------------------------- */
  /*                            Decorative Rings                                */
  /* -------------------------------------------------------------------------- */
  
  export const GLOW_RADII = [
    430,
    390,
    350,
  ];
  
  /* -------------------------------------------------------------------------- */
  /*                           Marker Colors                                    */
  /* -------------------------------------------------------------------------- */
  
  export const COLORS = {
    primary: "#16a34a",
  
    glow: "#22c55e",
  
    route: "#4ade80",
  
    grid: "#86efac",
  
    ring: "#bbf7d0",
  
    dot: "#dcfce7",
  } as const;