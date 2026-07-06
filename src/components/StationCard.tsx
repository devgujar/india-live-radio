import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, Pause, Play, Users } from "lucide-react";
import type { Station } from "../types";
import { usePlayer } from "../context/PlayerContext";
import { useFavorites } from "../context/FavoritesContext";
import { formatCount, splitTags } from "../lib/format";
import StationLogo from "./StationLogo";
import LiveBadge from "./LiveBadge";
import Equalizer from "./Equalizer";

interface Props {
  station: Station;
  index?: number;
}

const StationCard = forwardRef<HTMLDivElement, Props>(function StationCard(
  { station, index = 0 },
  ref,
) {
  const { current, status, play } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavorites();

  const isCurrent = current?.id === station.id;
  const isPlaying = isCurrent && status === "playing";
  const isLoading = isCurrent && status === "loading";
  const faved = isFavorite(station.id);

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.4) }}
      className={`card group relative overflow-hidden p-4 ${
        isCurrent ? "border-saffron/40 bg-white/[0.08] shadow-glow" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <StationLogo station={station} />
          <button
            onClick={() => play(station)}
            aria-label={isPlaying ? `Pause ${station.name}` : `Play ${station.name}`}
            className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 backdrop-blur-sm transition group-hover:opacity-100 focus-visible:opacity-100"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 translate-x-0.5" />
            )}
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-display font-semibold leading-tight">
              {station.name}
            </h3>
            <button
              onClick={() => toggleFavorite(station)}
              aria-label={faved ? "Remove from favorites" : "Add to favorites"}
              aria-pressed={faved}
              className="shrink-0 rounded-full p-1 text-white/50 transition hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
            >
              <Heart
                className={`h-5 w-5 ${faved ? "fill-red-500 text-red-500" : ""}`}
              />
            </button>
          </div>

          <p className="mt-1 flex items-center gap-1 truncate text-sm text-white/60">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {[station.city, station.language].filter(Boolean).join(" • ") ||
                station.country}
            </span>
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {splitTags(station.tags).map((tag, ti) => (
              <span
                key={`${tag}-${ti}`}
                className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-white/60">
          <LiveBadge />
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {formatCount(station.listeners)}
          </span>
        </div>

        {isPlaying ? (
          <div className="flex items-center gap-2 text-xs font-medium text-saffron-400">
            <Equalizer />
            On air
          </div>
        ) : (
          <button
            onClick={() => play(station)}
            className="btn-primary px-4 py-1.5 text-sm"
          >
            {isLoading ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <Play className="h-3.5 w-3.5 translate-x-0.5" />
            )}
            {isLoading ? "Buffering" : "Play"}
          </button>
        )}
      </div>
    </motion.article>
  );
});

export default StationCard;
