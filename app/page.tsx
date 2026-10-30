import OutfitToday from "./outfit-today";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
      <header className="mb-5 text-center">
        <h1 className="text-2xl font-bold leading-tight">
          What to Wear in <span className="text-(--accent-strong)">Tokyo</span> Today
        </h1>
        <p className="mt-1.5 text-sm text-(--muted)">
          A quick daily outfit guide for visitors, based on the season.
        </p>
      </header>

      <OutfitToday />

      <footer className="mt-8 text-center text-xs leading-relaxed text-(--muted)">
        <p>v0 — based on seasonal climate averages for Tokyo. Always check the live forecast too.</p>
      </footer>
    </main>
  );
}
