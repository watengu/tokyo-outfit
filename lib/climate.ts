// "What to Wear in Tokyo Today" — v0 logic.
//
// Everything is derived from a fixed in-code table of Tokyo monthly climate
// normals (approximate values in the style of the Japan Meteorological
// Agency's published normals for central Tokyo). There are no external APIs:
// the day's expected high/low are interpolated from the monthly normals,
// anchored on the 15th of each month, so the result is deterministic for a
// given JST date.

export interface MonthClimate {
  /** 1-12 */
  month: number;
  /** Average daily high, °C */
  high: number;
  /** Average daily low, °C */
  low: number;
  /** Typical conditions for the month */
  note: string;
}

export const TOKYO_CLIMATE: MonthClimate[] = [
  { month: 1, high: 9.8, low: 2.5, note: "Cold, dry and often sunny, with a wind that makes it feel colder." },
  { month: 2, high: 10.9, low: 2.9, note: "Still cold, with chilly rain and the odd rare snow day." },
  { month: 3, high: 14.2, low: 5.6, note: "Early spring. Big swings between day and night, and pollen season begins." },
  { month: 4, high: 19.4, low: 10.7, note: "Mild spring days and cooler evenings. Cherry blossom season." },
  { month: 5, high: 23.6, low: 15.4, note: "Warm and pleasant — one of the most comfortable months of the year." },
  { month: 6, high: 26.1, low: 19.1, note: "The rainy season (tsuyu): humid, with frequent rain." },
  { month: 7, high: 29.9, low: 23.1, note: "Hot and humid once the rains end, with strong sun." },
  { month: 8, high: 31.0, low: 24.3, note: "Peak summer heat and humidity, with the occasional typhoon." },
  { month: 9, high: 27.0, low: 20.9, note: "Warm and humid early on, cooling later in the month. Typhoon season." },
  { month: 10, high: 21.5, low: 15.2, note: "Comfortable autumn days — light jacket weather." },
  { month: 11, high: 16.3, low: 9.9, note: "Cool autumn days, and evenings turn properly chilly." },
  { month: 12, high: 11.7, low: 5.0, note: "Cold and dry, with crisp, sunny days." },
];

export interface Outfit {
  top: string;
  layer: string;
  bottom: string;
  shoes: string;
}

export interface BandSpec {
  id: string;
  label: string;
  summary: string;
  main: Outfit;
  smart: string;
  casual: string;
}

const BANDS: (BandSpec & { minHigh: number })[] = [
  {
    id: "peak-summer",
    minHigh: 30,
    label: "Peak summer",
    summary: "The hottest, most humid time of year in Tokyo. Dress for heat first, sightseeing second.",
    main: {
      top: "The lightest breathable top you have — linen, cotton or a quick-dry tee",
      layer: "Skip the layer outdoors. A hat or a UV parasol helps more than extra clothing",
      bottom: "Shorts, or a breezy skirt or wide-leg trousers",
      shoes: "Sandals or mesh sneakers",
    },
    smart: "A sleeveless or short-sleeve blouse with wide-leg linen trousers and flat sandals; carry a thin cardigan for icy air conditioning.",
    casual: "A loose T-shirt, shorts and sandals. Add a cap and sunglasses.",
  },
  {
    id: "hot",
    minHigh: 27,
    label: "Hot and humid",
    summary: "Summer heat. Light, loose and breathable beats stylish-but-heavy today.",
    main: {
      top: "Breathable short sleeves — linen or cotton",
      layer: "None outdoors; a very light layer only for strong air conditioning",
      bottom: "Shorts, a light skirt or wide-leg trousers",
      shoes: "Sandals or breathable sneakers",
    },
    smart: "A short-sleeve blouse and cropped wide trousers with low sandals.",
    casual: "T-shirt, shorts and sneakers, with a small towel for the humidity.",
  },
  {
    id: "warm",
    minHigh: 23,
    label: "Warm",
    summary: "Comfortably warm. Short sleeves work, with one light layer in reserve.",
    main: {
      top: "Short-sleeve shirt, blouse or T-shirt",
      layer: "A thin cardigan for air-conditioned trains and shops",
      bottom: "Light trousers, a skirt or shorts",
      shoes: "Breathable sneakers or sandals",
    },
    smart: "A blouse with a midi skirt or tapered trousers and loafers.",
    casual: "A T-shirt, jeans or shorts, and your most comfortable sneakers.",
  },
  {
    id: "mild",
    minHigh: 18,
    label: "Mild",
    summary: "The easiest dressing weather of the year — just keep a layer for the evening.",
    main: {
      top: "Long-sleeve shirt or a light knit",
      layer: "A light jacket or cardigan for the morning and evening",
      bottom: "Trousers, jeans or a midi skirt",
      shoes: "Comfortable walking shoes — you will walk a lot",
    },
    smart: "A shirt and blazer with tailored trousers and loafers.",
    casual: "A long-sleeve tee, light jacket and jeans with sneakers.",
  },
  {
    id: "chilly",
    minHigh: 13,
    label: "Chilly",
    summary: "Cool enough that you will want a real jacket, especially after sunset.",
    main: {
      top: "Long-sleeve top or a light knit sweater",
      layer: "A medium jacket or light coat — mornings and evenings are cold",
      bottom: "Long trousers or jeans, or a long skirt with tights",
      shoes: "Sneakers or loafers",
    },
    smart: "A knit top under a tailored coat, with ankle boots.",
    casual: "A sweatshirt or knit, a padded jacket and jeans.",
  },
  {
    id: "cold",
    minHigh: 8,
    label: "Cold",
    summary: "Proper winter-coat weather, especially once the sun goes down.",
    main: {
      top: "A warm knit or fleece over a long-sleeve shirt",
      layer: "A winter coat",
      bottom: "Long trousers or jeans; thermal leggings help on windy days",
      shoes: "Sneakers or boots",
    },
    smart: "A turtleneck under a long wool coat, tailored trousers and leather boots.",
    casual: "A hoodie under a warm jacket, jeans, and a beanie.",
  },
  {
    id: "deep-winter",
    minHigh: -Infinity,
    label: "Deep winter",
    summary: "The coldest days of the year. Warmth first — Tokyo wind cuts through thin coats.",
    main: {
      top: "A thermal base layer plus a thick knit sweater",
      layer: "A heavy winter coat (wool or down)",
      bottom: "Warm trousers or jeans, with thermal leggings underneath",
      shoes: "Closed shoes or boots",
    },
    smart: "A long wool coat over a turtleneck and tailored trousers, with leather boots and a scarf.",
    casual: "A down jacket, hoodie and jeans, plus a beanie and gloves.",
  },
];

function dayOfYear(year: number, month: number, day: number): number {
  const start = Date.UTC(year, 0, 1);
  const cur = Date.UTC(year, month - 1, day);
  return Math.round((cur - start) / 86400000) + 1;
}

function isLeap(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Interpolated expected high/low for a JST date, from the monthly normals
 * anchored on the 15th of each month.
 */
export function expectedTemps(
  year: number,
  month: number,
  day: number,
): { high: number; low: number; climate: MonthClimate } {
  const climate = TOKYO_CLIMATE[month - 1];
  const doy = dayOfYear(year, month, day);
  const yearLen = isLeap(year) ? 366 : 365;

  // Anchor day-of-year for the 15th of each month.
  const anchors = TOKYO_CLIMATE.map((c) => dayOfYear(year, c.month, 15));

  // Find the segment [anchor_i, anchor_{i+1}) containing doy (wrapping).
  let i = 0;
  let t = 0;
  if (doy < anchors[0]) {
    // Between Dec 15 of last year and Jan 15.
    i = 11;
    const span = anchors[0] + yearLen - anchors[11];
    t = (doy + yearLen - anchors[11]) / span;
  } else {
    for (let k = 0; k < 12; k++) {
      const a = anchors[k];
      const b = k === 11 ? anchors[0] + yearLen : anchors[k + 1];
      if (doy >= a && doy < b) {
        i = k;
        t = (doy - a) / (b - a);
        break;
      }
    }
  }
  const cur = TOKYO_CLIMATE[i];
  const nxt = TOKYO_CLIMATE[(i + 1) % 12];
  return {
    high: cur.high + (nxt.high - cur.high) * t,
    low: cur.low + (nxt.low - cur.low) * t,
    climate,
  };
}

export function bandForHigh(high: number): BandSpec {
  for (const b of BANDS) {
    if (high >= b.minHigh) return b;
  }
  return BANDS[BANDS.length - 1];
}

export function essentialsFor(month: number, high: number, low: number): string[] {
  const items: string[] = [];

  if (month === 6 || month === 7) {
    items.push("Folding umbrella — it is rainy season, and showers can start suddenly.");
    items.push("Shoes that can get wet, or a small towel for wet feet.");
  }
  if (month === 8 || month === 9) {
    items.push("It is typhoon season — check the forecast before heading out, and keep plans flexible.");
    items.push("A folding umbrella or a light rain jacket.");
  }
  if (high >= 27) {
    items.push("A water bottle — vending machines and convenience stores are everywhere, so refill often.");
    items.push("Sunscreen and a hat or sunglasses for the strong sun.");
  }
  if (month >= 3 && month <= 5) {
    items.push("Pollen season: a mask and sunglasses help on high-pollen days, especially in March and April.");
  }
  if (month === 12 || month === 1 || month === 2) {
    items.push("A scarf and gloves for the morning and evening cold.");
    items.push("The air is very dry — lip balm and hand cream come in handy.");
  }
  if (high - low >= 8) {
    items.push("Big day–night temperature gap — dress in layers you can take off and carry.");
  }
  items.push("Comfortable walking shoes: Tokyo sightseeing easily means 15,000+ steps.");
  items.push("A small bag that fits your passport, phone and an IC transit card (Suica or Pasmo).");

  return items;
}

export interface TodayOutfit {
  high: number;
  low: number;
  climateNote: string;
  band: BandSpec;
  essentials: string[];
}

export function getOutfitForDate(year: number, month: number, day: number): TodayOutfit {
  const { high, low, climate } = expectedTemps(year, month, day);
  return {
    high,
    low,
    climateNote: climate.note,
    band: bandForHigh(high),
    essentials: essentialsFor(month, high, low),
  };
}
