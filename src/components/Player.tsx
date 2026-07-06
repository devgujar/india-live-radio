import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Heart,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Share2,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import { useFavorites } from "../context/FavoritesContext";
import StationLogo from "./StationLogo";
import Equalizer from "./Equalizer";
import LiveBadge from "./LiveBadge";
import { formatCount } from "../lib/format";

export default function Player() {
  const {
    current,
    status,
    volume,
    muted,
    reconnectAttempt,
    toggle,
    stop,
    setVolume,
    toggleMute,
    retry,
  } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    if (!current) return;
    const shareData = {
      title: `${current.name} · India - Live Radio`,
      text: `I'm listening to ${current.name} on India - Live Radio 🎧`,
      url: current.homepage || window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text} ${shareData.url}`,
        );
        setShared(true);
        window.setTimeout(() => setShared(false), 2000);
      }
    } catch {
      /* user dismissed share sheet — ignore */
    }
  };

  const isPlaying = status === "playing";
  const isLoading = status === "loading";
  const isError = status === "error";
  const faved = current ? isFavorite(current.id) : false;

  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-50 px-2 pb-2 sm:px-4 sm:pb-4"
          role="region"
          aria-label="Audio player"
        >
          <div className="glass-strong mx-auto flex max-w-6xl items-center gap-3 rounded-2xl px-3 py-3 sm:gap-4 sm:px-4">
            {/* Now playing meta */}
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="relative shrink-0">
                <StationLogo station={current} className="h-12 w-12 sm:h-14 sm:w-14" />
                {isPlaying && (
                  <span className="absolute -bottom-1 -right-1 rounded-full bg-ink-800 p-1">
                    <Equalizer bars={3} className="h-3" />
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-display font-semibold leading-tight">
                    {current.name}
                  </p>
                  <LiveBadge className="hidden sm:inline-flex" />
                </div>
                <p className="truncate text-xs text-white/55">
                  {isError ? (
                    <span className="flex items-center gap-1 text-red-300">
                      <AlertTriangle className="h-3 w-3" /> Stream unavailable
                    </span>
                  ) : isLoading ? (
                    <span className="flex items-center gap-1 text-saffron-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      {reconnectAttempt > 0
                        ? `Reconnecting (${reconnectAttempt})…`
                        : "Buffering…"}
                    </span>
                  ) : (
                    [current.city, `${formatCount(current.listeners)} listeners`]
                      .filter(Boolean)
                      .join(" • ")
                  )}
                </p>
              </div>
            </div>

            {/* Primary controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {isError ? (
                <button
                  onClick={retry}
                  aria-label="Retry stream"
                  className="btn-primary h-11 w-11 !p-0"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={toggle}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="btn-primary h-11 w-11 !p-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 translate-x-0.5" />
                  )}
                </button>
              )}

              {/* Volume: hidden on small screens to save space */}
              <div className="hidden items-center gap-2 md:flex">
                <button
                  onClick={toggleMute}
                  aria-label={muted ? "Unmute" : "Mute"}
                  className="rounded-full p-2 text-white/70 transition hover:text-white"
                >
                  <VolumeIcon className="h-5 w-5" />
                </button>
                <input
                  type="range"
                  className="volume w-24"
                  min={0}
                  max={1}
                  step={0.01}
                  value={muted ? 0 : volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  aria-label="Volume"
                />
              </div>

              <button
                onClick={() => toggleFavorite(current)}
                aria-label={faved ? "Remove from favorites" : "Add to favorites"}
                aria-pressed={faved}
                className="rounded-full p-2 text-white/70 transition hover:text-red-400"
              >
                <Heart className={`h-5 w-5 ${faved ? "fill-red-500 text-red-500" : ""}`} />
              </button>

              <button
                onClick={handleShare}
                aria-label="Share station"
                className="relative rounded-full p-2 text-white/70 transition hover:text-white"
              >
                <Share2 className="h-5 w-5" />
                {shared && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[10px]">
                    Link copied!
                  </span>
                )}
              </button>

              <button
                onClick={stop}
                aria-label="Stop and close player"
                className="rounded-full p-2 text-white/50 transition hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
