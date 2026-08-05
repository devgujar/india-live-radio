import { useEffect, useState } from "react";
import type { Station } from "../types";
import { fetchByLanguage } from "../api/radioBrowser";
import { pickWorkingStations } from "../lib/probeStream";

/**
 * Session-lifetime cache for the "Trending now" list. Once resolved it is
 * reused for the rest of the session, so navigating away from and back to Home
 * shows the stations instantly without re-fetching or re-probing.
 */
let cache: Station[] | null = null;
let inflight: Promise<Station[]> | null = null;

function load(count: number): Promise<Station[]> {
  if (!inflight) {
    inflight = fetchByLanguage("hindi", 60)
      .then((candidates) => pickWorkingStations(candidates, count, 8))
      .then((working) => {
        cache = working;
        return working;
      })
      .catch((err) => {
        // Allow a later mount to retry rather than caching the failure.
        inflight = null;
        throw err;
      });
  }
  return inflight;
}

interface TrendingState {
  stations: Station[];
  loading: boolean;
}

/** Returns the cached trending Hindi stations, computing them once per session. */
export function useTrendingHindi(count = 8): TrendingState {
  const [stations, setStations] = useState<Station[]>(() => cache ?? []);
  const [loading, setLoading] = useState<boolean>(() => cache === null);

  useEffect(() => {
    if (cache) {
      setStations(cache);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    load(count)
      .then((res) => {
        if (cancelled) return;
        setStations(res);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [count]);

  return { stations, loading };
}
