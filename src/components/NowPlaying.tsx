import { motion } from "framer-motion";
import { Pause, Play, Radio, Users } from "lucide-react";
import type { Station } from "../types";
import { usePlayer } from "../context/PlayerContext";
import { formatCount } from "../lib/format";
import StationLogo from "./StationLogo";
import LiveBadge from "./LiveBadge";
import Equalizer from "./Equalizer";

interface Props {
  /** Fallback station to feature when nothing is playing yet. */
  fallback?: Station;
}

/**
 * Hero "Now Playing" panel. Shows the active station, or a suggested top
 * station as a preview before the user hits play.
 */
export default function NowPlaying({ fallback }: Props) {
  const { current, status, toggle, play } = usePlayer();
  const station = current ?? fallback;
  if (!station) return null;

  const isLive = !!current;
  const isPlaying = isLive && status === "playing";
  const isLoading = isLive && status === "loading";

  const handleClick = () => (isLive ? toggle() : play(station));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-saffron-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indiagreen-500/20 blur-3xl" />

      <div className="relative flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50">
        <Radio className="h-4 w-4" />
        {isLive ? "Now Playing" : "Suggested station"}
      </div>

      <div className="relative mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <div className={`${isPlaying ? "animate-floaty" : ""}`}>
            <StationLogo station={station} className="h-24 w-24 sm:h-28 sm:w-28" rounded="rounded-3xl" />
          </div>
          {isPlaying && (
            <span className="absolute -bottom-2 -right-2 rounded-full bg-ink-800 p-2 shadow-glow">
              <Equalizer bars={4} className="h-4" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <LiveBadge />
            <span className="text-xs text-white/50">
              {station.codec || "Live"} {station.bitrate ? `· ${station.bitrate}kbps` : ""}
            </span>
          </div>
          <h2 className="mt-2 truncate font-display text-2xl font-bold sm:text-3xl">
            {station.name}
          </h2>
          <p className="mt-1 text-white/60">
            {[station.city, station.language, station.tags.split(",")[0]]
              .filter(Boolean)
              .join(" • ")}
          </p>
          <div className="mt-3 flex items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" /> {formatCount(station.listeners)} listeners
            </span>
          </div>
        </div>

        <button
          onClick={handleClick}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="btn-primary h-16 w-16 shrink-0 self-start !p-0 sm:self-center"
        >
          {isLoading ? (
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : isPlaying ? (
            <Pause className="h-7 w-7" />
          ) : (
            <Play className="h-7 w-7 translate-x-0.5" />
          )}
        </button>
      </div>
    </motion.div>
  );
}
