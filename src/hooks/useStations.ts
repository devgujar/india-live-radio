import { useEffect, useState } from "react";
import type { Station } from "../types";

type Fetcher = (signal: AbortSignal) => Promise<Station[]>;

interface State {
  stations: Station[];
  loading: boolean;
  error: string | null;
}

/**
 * Generic async station loader with abort-on-unmount / dependency change.
 * `deps` controls when the fetch re-runs (like useEffect deps).
 */
export function useStations(fetcher: Fetcher, deps: unknown[]): State {
  const [state, setState] = useState<State>({
    stations: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));

    fetcher(controller.signal)
      .then((stations) => {
        if (controller.signal.aborted) return;
        setState({ stations, loading: false, error: null });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setState({
          stations: [],
          loading: false,
          error: err instanceof Error ? err.message : "Failed to load stations",
        });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
