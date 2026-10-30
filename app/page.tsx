import OutfitToday from "./outfit-today";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-5 pt-6 pb-10 sm:pt-10">
      <h1 className="sr-only">What to Wear in Tokyo Today</h1>

      <OutfitToday />

      <footer className="mt-12 flex items-baseline justify-between border-t border-(--line) pt-4 text-[11px] tracking-[0.14em] text-(--muted) uppercase">
        <span>Tokyo Outfit Daily</span>
        <span>v0.1 — seasonal averages, not a live forecast</span>
      </footer>
    </main>
  );
}
