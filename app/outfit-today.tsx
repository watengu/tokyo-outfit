"use client";

import { useEffect, useState } from "react";
import { getOutfitForDate, type TodayOutfit } from "@/lib/climate";

interface TodayView {
  dateLabel: string;
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

  return {
    dateLabel: `${get("weekday")}, ${monthLong} ${day}, ${year}`,
    outfit: getOutfitForDate(year, month, day),
  };
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 py-2.5 border-b border-(--line) last:border-b-0">
      <span className="w-16 shrink-0 text-xs font-bold tracking-wide text-(--accent-strong) uppercase pt-0.5">
        {label}
      </span>
      <span className="text-[15px] leading-relaxed">{value}</span>
    </div>
  );
}

export default function OutfitToday() {
  const [view, setView] = useState<TodayView | null>(null);

  useEffect(() => {
    setView(jstToday());
  }, []);

  if (!view) {
    return (
      <div className="rounded-2xl bg-(--surface) border border-(--line) p-6 text-center text-(--muted)">
        Checking what Tokyo usually feels like today…
      </div>
    );
  }

  const { outfit } = view;
  const { band } = outfit;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-sm font-medium text-(--muted)">{view.dateLabel} · Tokyo</p>

      <section className="rounded-2xl bg-(--surface) border border-(--line) p-5">
        <div className="flex items-end justify-center gap-6 text-center">
          <div>
            <div className="text-xs font-bold tracking-wide text-(--muted) uppercase">High</div>
            <div className="text-4xl font-bold text-(--sun)">{Math.round(outfit.high)}°C</div>
          </div>
          <div className="pb-1 text-2xl text-(--muted)">/</div>
          <div>
            <div className="text-xs font-bold tracking-wide text-(--muted) uppercase">Low</div>
            <div className="text-4xl font-bold text-(--accent)">{Math.round(outfit.low)}°C</div>
          </div>
        </div>
        <p className="mt-3 text-center text-lg font-bold">{band.label}</p>
        <p className="mt-1 text-center text-sm leading-relaxed text-(--muted)">{outfit.climateNote}</p>
        <p className="mt-3 rounded-lg bg-(--accent-soft) px-3 py-2 text-center text-xs leading-relaxed text-(--accent-strong)">
          These are seasonal averages for this time of year, based on Tokyo&apos;s climate
          normals — not a live forecast. Check the actual forecast before you head out.
        </p>
      </section>

      <section className="rounded-2xl bg-(--surface) border border-(--line) p-5">
        <h2 className="text-base font-bold">Today&apos;s outfit</h2>
        <p className="mt-1 text-sm leading-relaxed text-(--muted)">{band.summary}</p>
        <div className="mt-2">
          <Row label="Top" value={band.main.top} />
          <Row label="Layer" value={band.main.layer} />
          <Row label="Bottom" value={band.main.bottom} />
          <Row label="Shoes" value={band.main.shoes} />
        </div>
      </section>

      <section className="rounded-2xl bg-(--surface) border border-(--line) p-5">
        <h2 className="text-base font-bold">Other ways to wear it</h2>
        <div className="mt-3 flex flex-col gap-3">
          <div className="rounded-xl border border-(--line) p-3.5">
            <div className="text-xs font-bold tracking-wide text-(--accent-strong) uppercase">Smart</div>
            <p className="mt-1 text-[15px] leading-relaxed">{band.smart}</p>
          </div>
          <div className="rounded-xl border border-(--line) p-3.5">
            <div className="text-xs font-bold tracking-wide text-(--accent-strong) uppercase">Casual</div>
            <p className="mt-1 text-[15px] leading-relaxed">{band.casual}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-(--surface) border border-(--line) p-5">
        <h2 className="text-base font-bold">Don&apos;t forget</h2>
        <ul className="mt-2 list-disc pl-5 flex flex-col gap-1.5">
          {outfit.essentials.map((item) => (
            <li key={item} className="text-[15px] leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <p className="rounded-2xl border border-dashed border-(--accent) bg-(--accent-soft) px-4 py-3 text-sm leading-relaxed text-(--accent-strong)">
        Tip: layers are the key in spring and autumn. Days and evenings can feel like different
        seasons, and trains and shops are heated or cooled strongly — wear things you can add
        and remove easily.
      </p>
    </div>
  );
}
