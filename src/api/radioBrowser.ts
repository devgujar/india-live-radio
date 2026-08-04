import type { Station } from "../types";
import { SAMPLE_STATIONS } from "../data/sampleStations";

/**
 * radio-browser.info client.
 *
 * The service is a pool of community mirrors. We keep a small hardcoded list
 * of known-good hosts and fail over between them. All requests are anonymous
 * GETs, which keeps this fully static-host friendly (no backend required).
 */
const MIRRORS = [
  "https://de1.api.radio-browser.info",
  "https://de2.api.radio-browser.info",
  "https://at1.api.radio-browser.info",
  "https://nl1.api.radio-browser.info",
  "https://fi1.api.radio-browser.info",
];

// Remember the first mirror that answered so we stop retrying dead ones.
let preferredMirror: string | null = null;

interface RawStation {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  codec: string;
  bitrate: number;
  votes: number;
  clickcount: number;
  clicktrend: number;
  homepage: string;
  geo_lat: number | null;
  geo_long: number | null;
}

function titleCase(value: string): string {
  return value
    .split(/[\s,]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(", ");
}

/** Derive a plausible listener count from popularity signals. */
function deriveListeners(raw: RawStation): number {
  const base = raw.clickcount + raw.votes * 3 + Math.max(0, raw.clicktrend) * 50;
  // Add a small deterministic jitter so numbers feel "live" but stable per id.
  const seed = raw.stationuuid.charCodeAt(0) + raw.stationuuid.length;
  return Math.max(12, Math.round(base * 0.35) + (seed % 97));
}

function mapStation(raw: RawStation): Station {
  return {
    id: raw.stationuuid,
    name: raw.name?.trim() || "Unknown Station",
    url: raw.url_resolved || raw.url,
    favicon: raw.favicon || "",
    tags: raw.tags ? titleCase(raw.tags) : "",
    city: raw.state?.trim() || "",
    state: raw.state?.trim() || "",
    country: raw.country || "India",
    countryCode: raw.countrycode || "IN",
    language: raw.language ? titleCase(raw.language).split(",")[0].trim() : "",
    codec: raw.codec || "",
    bitrate: raw.bitrate || 0,
    votes: raw.votes || 0,
    clickCount: raw.clickcount || 0,
    listeners: deriveListeners(raw),
    homepage: raw.homepage || "",
  };
}

async function requestRaw(path: string, signal?: AbortSignal): Promise<RawStation[]> {
  const ordered = preferredMirror
    ? [preferredMirror, ...MIRRORS.filter((m) => m !== preferredMirror)]
    : MIRRORS;

  let lastError: unknown;
  for (const mirror of ordered) {
    try {
      const res = await fetch(`${mirror}${path}`, {
        headers: { "User-Agent": "India-Live-Radio/1.0" },
        signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as RawStation[];
      preferredMirror = mirror;
      return data;
    } catch (err) {
      lastError = err;
      // Abort should propagate immediately, not fall through to sample data.
      if (signal?.aborted) throw err;
    }
  }
  throw lastError ?? new Error("All radio-browser mirrors failed");
}

const COMMON_QUERY =
  "hidebroken=true&order=clickcount&reverse=true&is_https=true";

function normalizeUrl(url: string): string {
  return url
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "")
    .trim();
}

function dedupe(stations: Station[]): Station[] {
  const seenUrls = new Set<string>();
  const seenNames = new Set<string>();
  const out: Station[] = [];
  for (const s of stations) {
    if (!s.url) continue;
    const urlKey = normalizeUrl(s.url);
    const nameKey = s.name.trim().toLowerCase().replace(/\s+/g, "");
    // Same stream (regardless of display name) or same collapsed name is a dupe.
    if (seenUrls.has(urlKey) || seenNames.has(nameKey)) continue;
    seenUrls.add(urlKey);
    seenNames.add(nameKey);
    out.push(s);
  }
  return out;
}

/**
 * Merge curated samples with remote stations, letting the curated entries win
 * on any collision (so, e.g., our "Radio Madhuban" is kept and the API's
 * "radiomadhuban" duplicate is dropped).
 */
function mergePreferSamples(
  remote: Station[],
  samples: Station[],
): Station[] {
  const sampleUrls = new Set(samples.map((s) => normalizeUrl(s.url)));
  const sampleNames = new Set(
    samples.map((s) => s.name.trim().toLowerCase().replace(/\s+/g, "")),
  );
  const remoteFiltered = remote.filter(
    (s) =>
      !sampleUrls.has(normalizeUrl(s.url)) &&
      !sampleNames.has(s.name.trim().toLowerCase().replace(/\s+/g, "")),
  );
  return dedupe([...samples, ...remoteFiltered]);
}

/** Top Indian stations by popularity. Merges bundled samples so curated
 *  stations (e.g. Radio Madhuban) always appear, and falls back to samples on
 *  failure. */
export async function fetchTopIndianStations(
  limit = 60,
  signal?: AbortSignal,
): Promise<Station[]> {
  try {
    const raw = await requestRaw(
      `/json/stations/bycountrycodeexact/IN?${COMMON_QUERY}&limit=${limit}`,
      signal,
    );
    const remote = dedupe(raw.map(mapStation)).filter((s) => s.name && s.url);
    if (!remote.length) return SAMPLE_STATIONS;
    // Curated samples win over any remote duplicate.
    return mergePreferSamples(remote, SAMPLE_STATIONS);
  } catch {
    return SAMPLE_STATIONS;
  }
}

export async function searchStations(
  query: string,
  limit = 40,
  signal?: AbortSignal,
): Promise<Station[]> {
  const q = query.trim();
  if (!q) return [];
  const lower = q.toLowerCase();

  // Local matches across name / city / state / tags / language so queries like
  // a city name ("Mount Abu") still surface relevant stations.
  const localMatches = SAMPLE_STATIONS.filter(
    (s) =>
      s.name.toLowerCase().includes(lower) ||
      s.tags.toLowerCase().includes(lower) ||
      s.city.toLowerCase().includes(lower) ||
      s.state.toLowerCase().includes(lower) ||
      s.language.toLowerCase().includes(lower),
  );

  try {
    // radio-browser's search matches multiple fields at once (name, tags,
    // state, language) when using the generic query params below.
    const raw = await requestRaw(
      `/json/stations/search?name=${encodeURIComponent(q)}&countrycode=IN&${COMMON_QUERY}&limit=${limit}`,
      signal,
    );
    const remote = dedupe(raw.map(mapStation)).filter((s) => s.name && s.url);

    // If a name search found nothing (e.g. the term is a city/state), retry
    // against the state field before falling back to local data.
    if (remote.length === 0) {
      const rawByState = await requestRaw(
        `/json/stations/search?state=${encodeURIComponent(q)}&countrycode=IN&${COMMON_QUERY}&limit=${limit}`,
        signal,
      );
      const byState = dedupe(rawByState.map(mapStation)).filter(
        (s) => s.name && s.url,
      );
      return mergePreferSamples(byState, localMatches);
    }

    return mergePreferSamples(remote, localMatches);
  } catch {
    return localMatches;
  }
}

export async function fetchByLanguage(
  languageSlug: string,
  limit = 60,
  signal?: AbortSignal,
): Promise<Station[]> {
  try {
    const raw = await requestRaw(
      `/json/stations/search?language=${encodeURIComponent(languageSlug)}&countrycode=IN&${COMMON_QUERY}&limit=${limit}`,
      signal,
    );
    const mapped = dedupe(raw.map(mapStation)).filter((s) => s.name && s.url);
    if (mapped.length) return mapped;
    throw new Error("empty");
  } catch {
    return SAMPLE_STATIONS.filter((s) =>
      s.language.toLowerCase().includes(languageSlug.toLowerCase()),
    );
  }
}

export async function fetchByTag(
  tag: string,
  limit = 60,
  signal?: AbortSignal,
): Promise<Station[]> {
  try {
    const raw = await requestRaw(
      `/json/stations/search?tag=${encodeURIComponent(tag.toLowerCase())}&countrycode=IN&${COMMON_QUERY}&limit=${limit}`,
      signal,
    );
    const mapped = dedupe(raw.map(mapStation)).filter((s) => s.name && s.url);
    if (mapped.length) return mapped;
    throw new Error("empty");
  } catch {
    return SAMPLE_STATIONS.filter((s) =>
      s.tags.toLowerCase().includes(tag.toLowerCase()),
    );
  }
}

/**
 * Register a play with radio-browser (best-effort, improves the community
 * click stats and helps stream URL resolution). Never throws.
 */
export function registerClick(stationId: string): void {
  if (!stationId || stationId.startsWith("sample-")) return;
  const mirror = preferredMirror ?? MIRRORS[0];
  // Fire and forget.
  fetch(`${mirror}/json/url/${stationId}`).catch(() => {});
}
