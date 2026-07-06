import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type Hls from "hls.js";
import type { Station } from "../types";
import { registerClick } from "../api/radioBrowser";

export type PlaybackStatus =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "error";

interface PlayerContextValue {
  current: Station | null;
  status: PlaybackStatus;
  volume: number;
  muted: boolean;
  /** Number of automatic reconnect attempts for the current session. */
  reconnectAttempt: number;
  play: (station: Station) => void;
  toggle: () => void;
  stop: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  retry: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const MAX_RECONNECTS = 5;
const isHlsUrl = (url: string) => /\.m3u8(\?|$)/i.test(url);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const reconnectTimer = useRef<number | null>(null);
  const reconnectCount = useRef(0);
  const currentRef = useRef<Station | null>(null);

  const [current, setCurrent] = useState<Station | null>(null);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const [volume, setVolumeState] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  // Create the single, persistent audio element once.
  if (!audioRef.current && typeof Audio !== "undefined") {
    audioRef.current = new Audio();
    audioRef.current.preload = "none";
    audioRef.current.crossOrigin = "anonymous";
  }

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimer.current !== null) {
      window.clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
  }, []);

  const teardownHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  const playNative = useCallback((audio: HTMLAudioElement, url: string) => {
    audio.src = url;
    audio.load();
    audio.play().catch(() => setStatus("error"));
  }, []);

  const loadSource = useCallback(
    (station: Station) => {
      const audio = audioRef.current;
      if (!audio) return;

      teardownHls();
      setStatus("loading");

      if (isHlsUrl(station.url)) {
        // hls.js is heavy (~160KB gzip) so it's loaded on demand — only the
        // first time an HLS/M3U8 stream is played.
        import("hls.js")
          .then(({ default: Hls }) => {
            // The user may have switched stations while the chunk loaded.
            if (currentRef.current?.id !== station.id) return;

            if (Hls.isSupported()) {
              const hls = new Hls({
                lowLatencyMode: false,
                enableWorker: true,
                fragLoadingMaxRetry: 6,
                manifestLoadingMaxRetry: 4,
              });
              hlsRef.current = hls;
              hls.loadSource(station.url);
              hls.attachMedia(audio);
              hls.on(Hls.Events.MANIFEST_PARSED, () => {
                audio.play().catch(() => setStatus("error"));
              });
              hls.on(Hls.Events.ERROR, (_evt, data) => {
                if (!data.fatal) return;
                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                  hls.startLoad();
                } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                  hls.recoverMediaError();
                } else {
                  scheduleReconnect();
                }
              });
            } else {
              // Safari & iOS play HLS natively.
              playNative(audio, station.url);
            }
          })
          .catch(() => setStatus("error"));
      } else {
        playNative(audio, station.url);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [teardownHls, playNative],
  );

  const scheduleReconnect = useCallback(() => {
    const station = currentRef.current;
    if (!station) return;
    if (reconnectCount.current >= MAX_RECONNECTS) {
      setStatus("error");
      return;
    }
    reconnectCount.current += 1;
    setReconnectAttempt(reconnectCount.current);
    setStatus("loading");
    clearReconnectTimer();
    // Exponential-ish backoff capped at 8s.
    const delay = Math.min(8000, 1000 * reconnectCount.current);
    reconnectTimer.current = window.setTimeout(() => {
      loadSource(station);
    }, delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearReconnectTimer, loadSource]);

  const play = useCallback(
    (station: Station) => {
      const audio = audioRef.current;
      if (!audio) return;

      // Toggle pause/resume when tapping the already-loaded station.
      if (currentRef.current?.id === station.id) {
        if (audio.paused) audio.play().catch(() => setStatus("error"));
        else audio.pause();
        return;
      }

      clearReconnectTimer();
      reconnectCount.current = 0;
      setReconnectAttempt(0);
      currentRef.current = station;
      setCurrent(station);
      registerClick(station.id);
      loadSource(station);
    },
    [clearReconnectTimer, loadSource],
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentRef.current) return;
    if (audio.paused) audio.play().catch(() => setStatus("error"));
    else audio.pause();
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    clearReconnectTimer();
    teardownHls();
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    currentRef.current = null;
    setCurrent(null);
    setStatus("idle");
  }, [clearReconnectTimer, teardownHls]);

  const retry = useCallback(() => {
    const station = currentRef.current;
    if (!station) return;
    reconnectCount.current = 0;
    setReconnectAttempt(0);
    loadSource(station);
  }, [loadSource]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    setVolumeState(clamped);
    if (clamped > 0) setMuted(false);
  }, []);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  // Wire audio element event listeners once.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlaying = () => {
      reconnectCount.current = 0;
      setReconnectAttempt(0);
      setStatus("playing");
    };
    const onWaiting = () => setStatus("loading");
    const onPause = () => {
      if (currentRef.current) setStatus("paused");
    };
    const onError = () => scheduleReconnect();
    const onStalled = () => scheduleReconnect();
    const onEnded = () => scheduleReconnect();

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    audio.addEventListener("stalled", onStalled);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("stalled", onStalled);
      audio.removeEventListener("ended", onEnded);
    };
  }, [scheduleReconnect]);

  // Keep the element volume/mute in sync.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.muted = muted;
    }
  }, [volume, muted]);

  // Media Session API: lock-screen / hardware media keys.
  useEffect(() => {
    if (!("mediaSession" in navigator) || !current) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.name,
      artist: [current.city, current.language].filter(Boolean).join(" • "),
      album: "India - Live Radio",
      artwork: current.favicon
        ? [{ src: current.favicon, sizes: "512x512" }]
        : [],
    });
    navigator.mediaSession.setActionHandler("play", () => toggle());
    navigator.mediaSession.setActionHandler("pause", () => toggle());
    navigator.mediaSession.setActionHandler("stop", () => stop());
  }, [current, toggle, stop]);

  const value = useMemo<PlayerContextValue>(
    () => ({
      current,
      status,
      volume,
      muted,
      reconnectAttempt,
      play,
      toggle,
      stop,
      setVolume,
      toggleMute,
      retry,
    }),
    [
      current,
      status,
      volume,
      muted,
      reconnectAttempt,
      play,
      toggle,
      stop,
      setVolume,
      toggleMute,
      retry,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
