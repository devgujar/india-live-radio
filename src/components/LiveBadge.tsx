interface Props {
  label?: string;
  className?: string;
}

/** Red pulsing "LIVE" indicator. */
export default function LiveBadge({ label = "LIVE", className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-300 ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
      </span>
      {label}
    </span>
  );
}
