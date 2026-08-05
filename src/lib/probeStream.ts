import type { Station } from "../types";

const isHlsUrl = (url: string) => /\.m3u8(\?|$)/i.test(url);

/**
 * Probe a plain (non-HLS) audio stream by trying to load it in a detached,
 * muted <audio> element. Resolves true as soon as the browser signals the
 * stream is playable, false on error/stall/timeout.
 */
function probeNative(url: string, timeout: number): Promise<boolean> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.muted = true;
    audio.preload = "auto";

    let settled = false;
    const cleanup = () => {
      audio.removeEventListener("canplay", ok);
      audio.removeEventListener("loadeddata", ok);
      audio.removeEventListener("playing", ok);
      audio.removeEventListener("error", fail);
      audio.removeEventListener("stalled", fail);
      audio.removeEventListener("abort", fail);
      try {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      } catch {
        /* noop */
      }
    };
    const done = (result: boolean) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      cleanup();
      resolve(result);
    };
    const ok = () => done(true);
    const fail = () => done(false);

    audio.addEventListener("canplay", ok);
    audio.addEventListener("loadeddata", ok);
    audio.addEventListener("playing", ok);
    audio.addEventListener("error", fail);
    audio.addEventListener("stalled", fail);
    audio.addEventListener("abort", fail);

    const timer = window.setTimeout(() => done(false), timeout);

    try {
      audio.src = url;
      audio.load();
      // Muted playback is allowed without a gesture and kicks off loading.
      void audio.play().catch(() => {
        /* autoplay may reject; load events still tell us if it's playable */
      });
    } catch {
      done(false);
    }
  });
}

/**
 * Probe an HLS (.m3u8) stream using hls.js (or native HLS on Safari/iOS).
 * Resolves true once the manifest parses, false on fatal error/timeout.
 */
function probeHls(url: string, timeout: number): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    let timer = 0;
    const finish = (result: boolean, teardown?: () => void) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      teardown?.();
      resolve(result);
    };

    timer = window.setTimeout(() => finish(false), timeout);

    import("hls.js")
      .then(({ default: Hls }) => {
        if (settled) return;

        if (!Hls.isSupported()) {
          // Safari / iOS can play HLS natively — fall back to the audio probe.
          probeNative(url, timeout).then((r) => finish(r));
          return;
        }

        const audio = new Audio();
        audio.muted = true;
        const hls = new Hls({ enableWorker: false });
        const teardown = () => {
          try {
            hls.destroy();
            audio.removeAttribute("src");
            audio.load();
          } catch {
            /* noop */
          }
        };

        hls.on(Hls.Events.MANIFEST_PARSED, () => finish(true, teardown));
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (data.fatal) finish(false, teardown);
        });

        hls.loadSource(url);
        hls.attachMedia(audio);
      })
      .catch(() => finish(false));
  });
}

/** Returns true if the stream appears playable in this browser. */
export function probeStream(url: string, timeout = 7000): Promise<boolean> {
  if (!url) return Promise.resolve(false);
  return isHlsUrl(url) ? probeHls(url, timeout) : probeNative(url, timeout);
}

/**
 * Process-lifetime cache of probe results keyed by stream URL. The in-flight
 * promise is cached too, so concurrent callers (and later re-renders after
 * filtering) reuse a single network probe per URL instead of re-hitting it.
 */
const probeCache = new Map<string, Promise<boolean>>();

/** Cached variant of {@link probeStream} — one probe per URL per session. */
export function probeStreamCached(url: string, timeout = 4000): Promise<boolean> {
  if (!url) return Promise.resolve(false);
  let cached = probeCache.get(url);
  if (!cached) {
    cached = probeStream(url, timeout).catch(() => false);
    probeCache.set(url, cached);
  }
  return cached;
}

/**
 * Walk `candidates` and return up to `need` stations whose streams actually
 * play, probing at most `concurrency` at a time to limit bandwidth. Stops
 * early once `need` working stations are found or `signal` aborts. Order of
 * `candidates` is respected as closely as concurrency allows.
 */
export async function pickWorkingStations(
  candidates: Station[],
  need: number,
  concurrency = 4,
  signal?: AbortSignal,
): Promise<Station[]> {
  const working: Station[] = [];
  let cursor = 0;

  const worker = async () => {
    while (cursor < candidates.length && working.length < need) {
      if (signal?.aborted) return;
      const station = candidates[cursor++];
      const ok = await probeStreamCached(station.url);
      if (signal?.aborted) return;
      if (ok && working.length < need) working.push(station);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, candidates.length) }, worker),
  );

  return working.slice(0, need);
}
