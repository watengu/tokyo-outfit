"use client";

import { useEffect, useState } from "react";
import { getOutfitForDate, type TodayOutfit } from "@/lib/climate";

interface TodayView {
  dateLabel: string;
  shortDate: string;
  outfit: TodayOutfit;
}

function jstToday(): TodayView {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "long",
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const year = Number(get("year"));
  const month = Number(get("month"));
  const day = Number(get("day"));

  const monthLong = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    month: "long",
  }).format(now);
  const monthShort = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    month: "short",
  }).format(now);

  return {
    dateLabel: `${get("weekday")}, ${monthLong} ${day}, ${year}`,
    shortDate: `${monthShort} ${day}`,
    outfit: getOutfitForDate(year, month, day),
  };
}

/* Presentation-only verdict lines, derived from the existing temperature
   bands. The verdict always leads; the numbers follow as evidence. */
const VERDICTS: Record<string, { plain: string; accent: string }> = {
  "peak-summer": { plain: "Dress for", accent: "the heat." },
  hot: { plain: "Light, loose,", accent: "breathable." },
  warm: { plain: "Short sleeves,", accent: "one layer spare." },
  mild: { plain: "Light layers.", accent: "Mild & easy." },
  chilly: { plain: "Take a", accent: "real jacket." },
  cold: { plain: "Full", accent: "coat weather." },
  "deep-winter": { plain: "Bundle up.", accent: "Warmth first." },
};

function toF(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

type KitTab = "main" | "smart" | "casual";

const KIT_ROWS = [
  { key: "top", label: "Top" },
  { key: "layer", label: "Layer" },
  { key: "bottom", label: "Bottom" },
  { key: "shoes", label: "Shoes" },
] as const;

export default function OutfitToday() {
  const [view, setView] = useState<TodayView | null>(null);
  const [tab, setTab] = useState<KitTab>("main");

  useEffect(() => {
    setView(jstToday());
  }, []);

  if (!view) {
    return (
      <div className="pt-10">
        <p className="pulse-soft text-xs font-bold tracking-[0.3em] uppercase">
          Tokyo — checking the season…
        </p>
      </div>
    );
  }

  const { outfit } = view;
  const { band } = outfit;
  const verdict = VERDICTS[band.id] ?? { plain: band.label, accent: "" };
  const highC = Math.round(outfit.high);
  const lowC = Math.round(outfit.low);

  return (
    <div>
      {/* Meta bar */}
      <div
        className="rise flex items-baseline justify-between border-b-2 border-(--ink) pb-3"
        style={{ animationDelay: "0ms" }}
      >
        <span className="text-sm font-black tracking-tight uppercase">
          Tokyo<span className="text-(--accent)">.</span> Outfit Daily
        </span>
        <span className="font-mono text-[11px] tracking-[0.18em] text-(--muted) uppercase">
          {view.shortDate} — JST
        </span>
      </div>

      {/* Verdict first */}
      <section className="rise pt-8" style={{ animationDelay: "70ms" }}>
        <p className="text-[11px] font-bold tracking-[0.3em] text-(--accent) uppercase">
          What to wear today
        </p>
        <h2 className="mt-3 text-[17vw] leading-[0.92] font-black tracking-[-0.03em] text-balance sm:text-7xl">
          {verdict.plain}{" "}
          <span className="text-(--accent)">{verdict.accent}</span>
        </h2>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-(--muted)">
          {band.summary}
        </p>
        <figure className="mt-7 overflow-hidden rounded-[28px] border border-(--line)">
          {/* Relative src: resolves under the Pages basePath (/tokyo-outfit/)
              and against the site root in local dev. */}
          <img
            src="images/hero.webp"
            alt="Illustrated editorial image of a Tokyo street outfit"
            width={1280}
            height={1920}
            className="aspect-[4/5] w-full object-cover object-[50%_28%]"
          />
        </figure>
      </section>

      {/* Numbers as evidence */}
      <section
        className="rise mt-10 border-y border-(--line) py-4"
        style={{ animationDelay: "140ms" }}
      >
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] font-bold tracking-[0.22em] text-(--muted) uppercase">
              High
            </span>
            <span className="font-mono text-2xl font-bold tabular-nums">
              {highC}°C
            </span>
            <span className="font-mono text-sm text-(--muted) tabular-nums">
              {toF(highC)}°F
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] font-bold tracking-[0.22em] text-(--muted) uppercase">
              Low
            </span>
            <span className="font-mono text-2xl font-bold tabular-nums">
              {lowC}°C
            </span>
            <span className="font-mono text-sm text-(--muted) tabular-nums">
              {toF(lowC)}°F
            </span>
          </div>
          <span className="ml-auto font-mono text-[11px] tracking-[0.18em] uppercase">
            {band.label}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-(--muted)">{outfit.climateNote}</p>
        <p className="mt-2 text-xs leading-relaxed text-(--muted)">
          Seasonal averages for this time of year, from Tokyo&apos;s climate normals — not a
          live forecast. Check the actual forecast before you head out.
        </p>
      </section>

      {/* The kit — dark panel */}
      <section
        className="rise mt-8 rounded-[28px] bg-(--ink) px-6 py-6 text-(--bg) sm:px-8 sm:py-8"
        style={{ animationDelay: "210ms" }}
      >
        <div className="flex items-baseline justify-between">
          <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase">
            The kit
          </h3>
          <span className="font-mono text-[11px] text-(--muted-dark) tabular-nums">
            {view.dateLabel}
          </span>
        </div>

        <div
          className="mt-5 inline-flex rounded-full bg-white/10 p-1"
          role="tablist"
          aria-label="Outfit style"
        >
          {(["main", "smart", "casual"] as KitTab[]).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase transition-colors ${
                tab === t
                  ? "bg-(--bg) text-(--ink)"
                  : "text-(--muted-dark) hover:text-(--bg)"
              }`}
            >
              {t === "main" ? "Today's" : t}
            </button>
          ))}
        </div>

        {tab === "main" ? (
          <div className="mt-2">
            {KIT_ROWS.map((row, i) => (
              <div
                key={row.key}
                className="flex gap-4 border-b border-(--line-dark) py-4 last:border-b-0"
              >
                <span className="font-mono text-xs text-(--accent-bright) tabular-nums pt-1">
                  0{i + 1}
                </span>
                <div>
                  <div className="text-[11px] font-bold tracking-[0.24em] text-(--muted-dark) uppercase">
                    {row.label}
                  </div>
                  <p className="mt-1 text-[15px] leading-relaxed">{band.main[row.key]}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-5 text-base leading-relaxed">
            {tab === "smart" ? band.smart : band.casual}
          </p>
        )}
      </section>

      {/* Essentials checklist */}
      <section className="rise mt-10" style={{ animationDelay: "280ms" }}>
        <div className="flex items-baseline justify-between">
          <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase">
            Before you go out
          </h3>
          <span className="font-mono text-[11px] text-(--muted) tabular-nums">
            {outfit.essentials.length} items
          </span>
        </div>
        <ul className="mt-4">
          {outfit.essentials.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 border-b border-(--line) py-3 last:border-b-0"
            >
              <span
                aria-hidden
                className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border-2 border-(--ink) text-[11px] font-black text-(--accent)"
              >
                ✓
              </span>
              <span className="text-[15px] leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Local know-how */}
      <p
        className="rise mt-8 border-l-2 border-(--accent) pl-4 text-sm leading-relaxed text-(--muted)"
        style={{ animationDelay: "350ms" }}
      >
        Layers are the key in spring and autumn — days and evenings can feel like different
        seasons, and trains and shops are heated or cooled strongly. Wear things you can add
        and remove easily.
      </p>
    </div>
  );
}
