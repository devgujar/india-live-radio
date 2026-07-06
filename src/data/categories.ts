export interface Category {
  name: string;
  /** radio-browser language slug (lowercase). */
  slug: string;
  gradient: string;
  emoji: string;
}

export const LANGUAGES: Category[] = [
  { name: "Hindi", slug: "hindi", gradient: "from-orange-500 to-rose-500", emoji: "🎶" },
  { name: "Marathi", slug: "marathi", gradient: "from-amber-500 to-orange-600", emoji: "🥁" },
  { name: "Tamil", slug: "tamil", gradient: "from-red-500 to-pink-600", emoji: "🎬" },
  { name: "Telugu", slug: "telugu", gradient: "from-fuchsia-500 to-purple-600", emoji: "🎧" },
  { name: "Bengali", slug: "bengali", gradient: "from-emerald-500 to-teal-600", emoji: "🪕" },
  { name: "Punjabi", slug: "punjabi", gradient: "from-yellow-500 to-amber-600", emoji: "🎉" },
  { name: "Malayalam", slug: "malayalam", gradient: "from-green-500 to-emerald-600", emoji: "🌴" },
  { name: "Kannada", slug: "kannada", gradient: "from-rose-500 to-red-600", emoji: "🎤" },
  { name: "Gujarati", slug: "gujarati", gradient: "from-sky-500 to-indigo-600", emoji: "💃" },
];

/** Popular Indian cities used for the city-wise page. */
export const CITIES: string[] = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Chandigarh",
  "Kochi",
];

export const GENRES: string[] = [
  "Bollywood",
  "News",
  "Talk",
  "Classical",
  "Devotional",
  "Pop",
  "Retro",
  "Regional",
  "Sports",
];
