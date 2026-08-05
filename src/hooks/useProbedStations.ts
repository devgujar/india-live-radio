import { useEffect, useState } from "react";
import type { Station } from "../types";
import { probeStreamCached } from "../lib/probeStream";

interface ProbedState {
  /** Stations (in original order) whose streams actually play. */
  stations: Station[];
  /** True while probes are still in flight and nothing has passed yet. */
  probing: boolean;
}

/**
 * Progressively filters `input` down to stations whose streams are actually
 * playable, probing at most `max` of them (in order) with bounded
 * `concurrency`. Working stations are revealed as soon as each probe passes,
 * so the UI fills in incrementally rather than blocking on the slowest probe.
 * Probe results are cached per URL for the session, so re-filtering the same
 * catalogue is effectively free after the first pass.
 */
export function useProbedStations(
  input: Station[],
  max = 60,
  concurrency = 6,
): ProbedState {
  const [stations, setStations] = useState<Station[]>([]);
  const [probing, setProbing] = useState(false);

  useEffect(() => {
    const subset = input.slice(0, max);
    if (subset.length === 0) {
      setStations([]);
      setProbing(false);
      return;
    }

    let cancelled = false;
    setProbing(true);
    setStations([]);

    const results = new Array<boolean | undefined>(subset.length);
    let cursor = 0;

    const flush = () => {
      if (cancelled) return;
      setStations(subset.filter((_, i) => results[i] === true));
    };

    const worker = async () => {
      while (cursor < subset.length && !cancelled) {
        const i = cursor++;
        const ok = await probeStreamCached(subset[i].url);
        if (cancelled) return;
        results[i] = ok;
        if (ok) flush();
      }
    };

    Promise.all(
      Array.from({ length: Math.min(concurrency, subset.length) }, worker),
    ).then(() => {
      if (!cancelled) setProbing(false);
    });

    return () => {
      cancelled = true;
    };
  }, [input, max, concurrency]);

  return { stations, probing };
}
