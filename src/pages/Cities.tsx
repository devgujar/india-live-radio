import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { fetchTopIndianStations } from "../api/radioBrowser";
import { useStations } from "../hooks/useStations";
import { CITIES } from "../data/categories";
import StationGrid from "../components/StationGrid";
import { StationGridSkeleton } from "../components/Loader";

export default function Cities() {
  const [city, setCity] = useState(CITIES[0]);
  const { stations, loading } = useStations(
    (signal) => fetchTopIndianStations(200, signal),
    [],
  );

  const byCity = useMemo(() => {
    const term = city.toLowerCase();
    return stations.filter((s) =>
      [s.city, s.state, s.name, s.tags].some((f) =>
        f.toLowerCase().includes(term),
      ),
    );
  }, [stations, city]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-40 pt-10 sm:px-6">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Stations by <span className="gradient-text">city</span>
        </h1>
        <p className="mt-2 text-white/60">
          Local radio from India's biggest cities.
        </p>
      </header>

      <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2">
        {CITIES.map((c) => (
          <motion.button
            key={c}
            whileHover={{ y: -2 }}
            onClick={() => setCity(c)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition ${
              c === city
                ? "bg-gradient-to-r from-saffron-500 to-indiagreen-500 text-white shadow-glow"
                : "glass text-white/70 hover:text-white"
            }`}
          >
            <MapPin className="h-4 w-4" />
            {c}
          </motion.button>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-5 section-title flex items-center gap-2">
          <MapPin className="h-6 w-6 text-saffron-400" /> {city}
        </h2>
        {loading ? (
          <StationGridSkeleton count={8} />
        ) : (
          <StationGrid
            stations={byCity}
            emptyMessage={`No stations tagged for ${city} yet. Explore live stations or another city.`}
          />
        )}
      </div>
    </div>
  );
}
