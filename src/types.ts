export interface Station {
  /** Stable unique id (radio-browser stationuuid, or sample id). */
  id: string;
  name: string;
  /** Primary stream URL (already resolved when possible). */
  url: string;
  /** Logo / artwork url. */
  favicon: string;
  /** Comma-joined tags/genre. */
  tags: string;
  /** Human readable location, e.g. "Mumbai". */
  city: string;
  state: string;
  country: string;
  countryCode: string;
  /** Primary language label, e.g. "Hindi". */
  language: string;
  codec: string;
  bitrate: number;
  /** Popularity metric (clickcount from radio-browser). */
  votes: number;
  clickCount: number;
  /** Approximate live listeners (derived / from API when present). */
  listeners: number;
  homepage: string;
  /** true when this is bundled sample data (offline-friendly). */
  isSample?: boolean;
}
