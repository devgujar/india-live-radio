interface Props {
  label?: string;
  count?: number;
}

/** Skeleton grid shown while stations load. */
export function StationGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card relative overflow-hidden p-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-3/4 rounded bg-white/10" />
              <div className="h-3 w-1/2 rounded bg-white/10" />
            </div>
          </div>
          <div className="mt-4 h-3 w-2/3 rounded bg-white/10" />
          <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      ))}
    </div>
  );
}

export default function Loader({ label = "Loading stations…" }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-white/70">
      <div className="relative h-12 w-12">
        <span className="absolute inset-0 rounded-full border-2 border-white/10" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-saffron-500 border-r-indiagreen-500" />
      </div>
      <p className="text-sm">{label}</p>
    </div>
  );
}
