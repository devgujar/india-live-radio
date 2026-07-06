import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchByLanguage } from "../api/radioBrowser";
import { useStations } from "../hooks/useStations";
import { LANGUAGES } from "../data/categories";
import StationGrid from "../components/StationGrid";
import { StationGridSkeleton } from "../components/Loader";

export default function Categories() {
  const [params, setParams] = useSearchParams();
  const active = params.get("lang") || LANGUAGES[0].slug;
  const activeCat = LANGUAGES.find((l) => l.slug === active) ?? LANGUAGES[0];

  const { stations, loading } = useStations(
    (signal) => fetchByLanguage(activeCat.slug, 60, signal),
    [activeCat.slug],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-40 pt-10 sm:px-6">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Radio by <span className="gradient-text">language</span>
        </h1>
        <p className="mt-2 text-white/60">
          Discover stations in your mother tongue.
        </p>
      </header>

      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
        {LANGUAGES.map((cat) => {
          const isActive = cat.slug === activeCat.slug;
          return (
            <motion.button
              key={cat.slug}
              whileHover={{ y: -2 }}
              onClick={() => setParams({ lang: cat.slug })}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 font-medium transition ${
                isActive
                  ? `bg-gradient-to-br ${cat.gradient} text-white shadow-glow`
                  : "glass text-white/70 hover:text-white"
              }`}
            >
              <span className="text-lg">{cat.emoji}</span>
              {cat.name}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8">
        <h2 className="mb-5 section-title">
          {activeCat.emoji} {activeCat.name} stations
        </h2>
        {loading ? (
          <StationGridSkeleton count={8} />
        ) : (
          <StationGrid
            stations={stations}
            emptyMessage={`No ${activeCat.name} stations available right now. Try another language.`}
          />
        )}
      </div>
    </div>
  );
}
