import { Search, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search stations, genres, cities…",
  autoFocus = false,
}: Props) {
  return (
    <div className="glass flex items-center gap-3 rounded-full px-4 py-3">
      <Search className="h-5 w-5 shrink-0 text-white/50" />
      <input
        type="search"
        value={value}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search stations"
        className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="rounded-full p-1 text-white/50 transition hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
