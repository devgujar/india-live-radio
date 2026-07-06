import { useState } from "react";
import { gradientFor, initials } from "../lib/format";
import type { Station } from "../types";

interface Props {
  station: Station;
  className?: string;
  rounded?: string;
}

/**
 * Station artwork with graceful fallback: many radio-browser favicons are dead
 * links, so we swap to a branded gradient monogram if the image fails to load.
 */
export default function StationLogo({
  station,
  className = "h-14 w-14",
  rounded = "rounded-xl",
}: Props) {
  const [broken, setBroken] = useState(false);
  const showImage = station.favicon && !broken;

  if (showImage) {
    return (
      <img
        src={station.favicon}
        alt={`${station.name} logo`}
        loading="lazy"
        onError={() => setBroken(true)}
        className={`${className} ${rounded} object-cover bg-white/10`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`${className} ${rounded} bg-gradient-to-br ${gradientFor(
        station.id,
      )} flex items-center justify-center font-display font-bold text-white/95`}
    >
      {initials(station.name)}
    </div>
  );
}
