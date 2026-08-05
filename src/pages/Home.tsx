import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fetchByLanguage, fetchTopIndianStations, searchStations } from "../api/radioBrowser";
import { useStations } from "../hooks/useStations";
import { SAMPLE_STATIONS } from "../data/sampleStations";
import type { Station } from "../types";
import SearchBar from "../components/SearchBar";
import CategoryCards from "../components/CategoryCards";
import StationGrid from "../components/StationGrid";
import { StationGridSkeleton } from "../components/Loader";

export default function Home() {
  const { stations, loading } = useStations(
    (signal) => fetchTopIndianStations(60, signal),
    [],
  );

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(query.trim()), 350);
    return () => window.clearTimeout(t);
  }, [query]);

  const { stations: results, loading: searching } = useStations(
    (signal) =>
      debounced
        ? searchStations(debounced, 60, signal)
        : Promise.resolve([] as Station[]),
    [debounced],
  );

  const list = stations.length ? stations : SAMPLE_STATIONS;
  const { stations: hindiStations, loading: hindiLoading } = useStations(
    (signal) => fetchByLanguage("hindi", 60, signal),
    [],
  );

  const trending = useMemo(() => hindiStations.slice(0, 8), [hindiStations]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-40 pt-6 sm:px-6">
      {/* Hero */}
      <section className="py-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap items-center gap-6">
            <dl className="flex gap-8">
              <Link to="/" className="group block">
                <dt className="text-sm text-white/50 group-hover:text-white/80">Live</dt>
                <dd className="font-display text-2xl font-bold gradient-text">
                  24×7
                </dd>
              </Link>
              <Link to="/live" className="group block">
                <dt className="text-sm text-white/50 group-hover:text-white/80">Stations</dt>
                <dd className="font-display text-2xl font-bold gradient-text">
                  {list.length}+
                </dd>
              </Link>
              <Link to="/categories" className="group block">
                <dt className="text-sm text-white/50 group-hover:text-white/80">Languages</dt>
                <dd className="font-display text-2xl font-bold gradient-text">9</dd>
              </Link>
              <Link to="/cities" className="group block">
                <dt className="text-sm text-white/50 group-hover:text-white/80">Cities</dt>
                <dd className="font-display text-2xl font-bold gradient-text">12+</dd>
              </Link>
            </dl>
          </div>

          <div className="mt-3 w-full">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder="Search stations, genres, cities…"
            />
          </div>

          {debounced ? (
            <div className="mt-6">
              {searching ? (
                <StationGridSkeleton count={8} />
              ) : (
                <StationGrid
                  stations={results}
                  emptyMessage={`No stations match “${debounced}”.`}
                />
              )}
            </div>
          ) : null}
        </motion.div>
      </section>

      {/* Intro */}
      <p className="mt-6 mb-6 max-w-2xl text-lg text-white/60 lg:max-w-none lg:whitespace-nowrap">
        Stream hundreds of live FM & online radio stations — Hindi, Tamil, Marathi, Telugu and more. Search, filter by city, and save your favorites. No sign-up required.
      </p>

      {/* Trending */}
      <section className="mt-6">
        <div className="mb-5 flex flex-wrap items-center gap-4">
          <h2 className="section-title">Trending now</h2>
          <Link
            to="/live"
            className="btn-primary inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold shadow-glow"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {hindiLoading ? (
          <StationGridSkeleton count={8} />
        ) : (
          <StationGrid stations={trending} />
        )}
      </section>

      {/* Categories */}
      <section className="mt-16">
        <div className="mb-5 flex flex-wrap items-center gap-4">
          <h2 className="section-title">Languages</h2>
          <Link
            to="/categories"
            className="btn-primary inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold shadow-glow"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <CategoryCards />
      </section>
    </div>
  );
}
