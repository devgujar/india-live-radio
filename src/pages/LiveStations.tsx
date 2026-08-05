import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { fetchTopIndianStations, searchStations } from "../api/radioBrowser";
import { useStations } from "../hooks/useStations";
import { useProbedStations } from "../hooks/useProbedStations";
import { LANGUAGES, GENRES } from "../data/categories";
import type { Station } from "../types";
import SearchBar from "../components/SearchBar";
import StationGrid from "../components/StationGrid";
import StationCard from "../components/StationCard";
import { StationGridSkeleton } from "../components/Loader";

type SortKey = "popular" | "name" | "listeners";

export default function LiveStations() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [language, setLanguage] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchResults, setSearchResults] = useState<Station[] | null>(null);
  const [searching, setSearching] = useState(false);

  // Base catalogue (top Indian stations).
  const { stations: base, loading } = useStations(
    (signal) => fetchTopIndianStations(120, signal),
    [],
  );

  // Debounce the search input.
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(query.trim()), 350);
    return () => window.clearTimeout(t);
  }, [query]);

  // Run remote search when a debounced query exists.
  useEffect(() => {
    if (!debounced) {
      setSearchResults(null);
      return;
    }
    const controller = new AbortController();
    setSearching(true);
    searchStations(debounced, 60, controller.signal)
      .then((res) => !controller.signal.aborted && setSearchResults(res))
      .catch(() => !controller.signal.aborted && setSearchResults([]))
      .finally(() => !controller.signal.aborted && setSearching(false));
    return () => controller.abort();
  }, [debounced]);

  const source = searchResults ?? base;

  const filtered = useMemo(() => {
    let list = [...source];
    if (language) {
      list = list.filter((s) =>
        s.language.toLowerCase().includes(language.toLowerCase()),
      );
    }
    if (genre) {
      list = list.filter((s) =>
        s.tags.toLowerCase().includes(genre.toLowerCase()),
      );
    }
    switch (sort) {
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "listeners":
        list.sort((a, b) => b.listeners - a.listeners);
        break;
      default:
        list.sort((a, b) => b.clickCount - a.clickCount);
    }
    return list;
  }, [source, language, genre, sort]);

  const { stations: playable, probing } = useProbedStations(filtered, 60, 12);

  const isBusy = loading || searching || (probing && playable.length === 0);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-40 pt-10 sm:px-6">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Live <span className="gradient-text">stations</span>
        </h1>
        <p className="mt-2 text-white/60">
          {playable.length} stations streaming live right now.
        </p>
      </header>

      <div className="glass z-30 space-y-4 rounded-2xl p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex-1">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <SlidersHorizontal className="h-4 w-4" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort stations"
                className="rounded-lg bg-white/5 px-3 py-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron/60"
              >
                <option value="popular">Most popular</option>
                <option value="listeners">Most listeners</option>
                <option value="name">A–Z</option>
              </select>
            </div>
            <div className="flex rounded-lg bg-white/5 p-1">
              <button
                onClick={() => setView("grid")}
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                className={`rounded-md p-2 ${view === "grid" ? "bg-white/15" : "text-white/60"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView("list")}
                aria-label="List view"
                aria-pressed={view === "list"}
                className={`rounded-md p-2 ${view === "list" ? "bg-white/15" : "text-white/60"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setLanguage("")}
            className={`chip ${!language ? "chip-active" : ""}`}
          >
            All languages
          </button>
          {LANGUAGES.map((l) => (
            <button
              key={l.slug}
              onClick={() => setLanguage(language === l.name ? "" : l.name)}
              className={`chip ${language === l.name ? "chip-active" : ""}`}
            >
              {l.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setGenre("")}
            className={`chip ${!genre ? "chip-active" : ""}`}
          >
            All genres
          </button>
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(genre === g ? "" : g)}
              className={`chip ${genre === g ? "chip-active" : ""}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {isBusy ? (
          <StationGridSkeleton count={12} />
        ) : view === "grid" ? (
          <StationGrid stations={playable} />
        ) : (
          <motion.div layout className="flex flex-col gap-3">
            {playable.map((s, i) => (
              <StationCard key={s.id} station={s} index={i} />
            ))}
            {playable.length === 0 && (
              <p className="glass rounded-2xl px-6 py-12 text-center text-white/60">
                No stations found. Try a different search or filter.
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
