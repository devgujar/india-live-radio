import { useEffect, useState } from "react";
import { searchStations } from "../api/radioBrowser";
import { useStations } from "../hooks/useStations";
import type { Station } from "../types";
import SearchBar from "../components/SearchBar";
import StationGrid from "../components/StationGrid";
import { StationGridSkeleton } from "../components/Loader";

export default function Search() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(query.trim()), 350);
    return () => window.clearTimeout(t);
  }, [query]);

  const { stations, loading } = useStations(
    (signal) =>
      debounced
        ? searchStations(debounced, 60, signal)
        : Promise.resolve([] as Station[]),
    [debounced],
  );

  return (
    <div className="mx-auto max-w-4xl px-4 pb-40 pt-10 sm:px-6">
      <SearchBar
        value={query}
        onChange={setQuery}
        autoFocus
        placeholder="What do you want to listen to?"
      />

      <div className="mt-8">
        {!debounced ? null : loading ? (
          <StationGridSkeleton count={8} />
        ) : (
          <StationGrid
            stations={stations}
            emptyMessage={`No stations match “${debounced}”.`}
          />
        )}
      </div>
    </div>
  );
}
