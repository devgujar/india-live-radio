interface Props {
  bars?: number;
  className?: string;
  animate?: boolean;
}

/** Animated audio equalizer used to mark the currently-playing station. */
export default function Equalizer({
  bars = 4,
  className = "",
  animate = true,
}: Props) {
  return (
    <div
      className={`flex h-4 items-end gap-0.5 ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="eq-bar"
          style={{
            height: animate ? undefined : "35%",
            animationPlayState: animate ? "running" : "paused",
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}
