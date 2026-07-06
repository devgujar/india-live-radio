import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, Users } from "lucide-react";
import type { Station } from "../types";
import { usePlayer } from "../context/PlayerContext";
import { formatCount } from "../lib/format";
import StationLogo from "./StationLogo";
import LiveBadge from "./LiveBadge";
import Equalizer from "./Equalizer";

interface Props {
  stations: Station[];
}

export default function FeaturedCarousel({ stations }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const { current, status, play } = usePlayer();

  const scrollBy = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  if (stations.length === 0) return null;

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="section-title">Featured live stations</h2>
        <div className="hidden gap-2 sm:flex">
          <button onClick={() => scrollBy(-1)} aria-label="Scroll left" className="btn-ghost h-9 w-9 !p-0">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => scrollBy(1)} aria-label="Scroll right" className="btn-ghost h-9 w-9 !p-0">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
      >
        {stations.map((station, i) => {
          const isCurrent = current?.id === station.id;
          const isPlaying = isCurrent && status === "playing";
          return (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.05, 0.3) }}
              className="group relative w-64 shrink-0 snap-start overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-saffron-600/30 via-navy/30 to-indiagreen-600/30" />
              <div className="glass relative flex h-full flex-col justify-between rounded-3xl p-5">
                <div className="flex items-start justify-between">
                  <StationLogo station={station} className="h-16 w-16" rounded="rounded-2xl" />
                  <LiveBadge />
                </div>
                <div className="mt-6">
                  <h3 className="truncate font-display text-lg font-bold">{station.name}</h3>
                  <p className="truncate text-sm text-white/60">
                    {[station.city, station.language].filter(Boolean).join(" • ") || station.country}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-white/60">
                    <Users className="h-3.5 w-3.5" /> {formatCount(station.listeners)}
                  </span>
                  <button
                    onClick={() => play(station)}
                    aria-label={isPlaying ? `Pause ${station.name}` : `Play ${station.name}`}
                    className="btn-primary h-10 w-10 !p-0"
                  >
                    {isPlaying ? <Pause className="h-4.5 w-4.5" /> : <Play className="h-4.5 w-4.5 translate-x-0.5" />}
                  </button>
                </div>
                {isPlaying && (
                  <div className="absolute right-5 top-16">
                    <Equalizer />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
