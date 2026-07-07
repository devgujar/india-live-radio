import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { fetchTopIndianStations } from "../api/radioBrowser";
import { useStations } from "../hooks/useStations";
import { SAMPLE_STATIONS } from "../data/sampleStations";
import NowPlaying from "../components/NowPlaying";
import FeaturedCarousel from "../components/FeaturedCarousel";
import CategoryCards from "../components/CategoryCards";
import StationGrid from "../components/StationGrid";
import { StationGridSkeleton } from "../components/Loader";

export default function Home() {
  const { stations, loading } = useStations(
    (signal) => fetchTopIndianStations(60, signal),
    [],
  );

  const list = stations.length ? stations : SAMPLE_STATIONS;
  const featured = useMemo(() => list.slice(0, 10), [list]);
  const trending = useMemo(() => list.slice(0, 8), [list]);
  const fallback = list[0];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-40 pt-10 sm:px-6">
      {/* Hero */}
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="chip inline-flex w-fit gap-2">
            <Sparkles className="h-4 w-4 text-saffron-400" />
            Live across India, 24×7
          </span>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Tune into the <span className="gradient-text">sound of India</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg text-white/60">
            Stream hundreds of live FM & online radio stations — Hindi, Tamil,
            Marathi, Telugu and more. Search, filter by city, and save your
            favorites. No sign-up required.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/categories" className="btn-primary px-6 py-3 text-base">
              Explore languages <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/live" className="btn-ghost px-6 py-3 text-base">
              Browse live stations
            </Link>
          </div>
          <dl className="mt-8 flex gap-8">
            <div>
              <dt className="text-sm text-white/50">Stations</dt>
              <dd className="font-display text-2xl font-bold gradient-text">
                {list.length}+
              </dd>
            </div>
            <div>
              <dt className="text-sm text-white/50">Languages</dt>
              <dd className="font-display text-2xl font-bold gradient-text">9</dd>
            </div>
            <div>
              <dt className="text-sm text-white/50">Cities</dt>
              <dd className="font-display text-2xl font-bold gradient-text">12+</dd>
            </div>
          </dl>
        </motion.div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 animate-floaty rounded-3xl bg-tiranga opacity-20 blur-3xl" />
          <NowPlaying fallback={fallback} />
        </div>
      </section>

      {/* Categories */}
      <section className="mt-16">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="section-title">Browse by language</h2>
          <Link to="/categories" className="text-sm text-white/60 hover:text-white">
            View all
          </Link>
        </div>
        <CategoryCards />
      </section>

      {/* Featured */}
      <section className="mt-16">
        <FeaturedCarousel stations={featured} />
      </section>

      {/* Trending */}
      <section className="mt-16">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="section-title">Trending now</h2>
          <Link to="/live" className="text-sm text-white/60 hover:text-white">
            See all
          </Link>
        </div>
        {loading ? (
          <StationGridSkeleton count={8} />
        ) : (
          <StationGrid stations={trending} />
        )}
      </section>
    </div>
  );
}
