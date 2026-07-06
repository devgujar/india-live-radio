import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Station } from "../types";

const STORAGE_KEY = "india-live-radio:favorites";

interface FavoritesContextValue {
  favorites: Station[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (station: Station) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function loadFavorites(): Station[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Station[]) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Station[]>(loadFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      /* storage unavailable (private mode) — ignore */
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (id: string) => favorites.some((s) => s.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback((station: Station) => {
    setFavorites((prev) =>
      prev.some((s) => s.id === station.id)
        ? prev.filter((s) => s.id !== station.id)
        : [station, ...prev],
    );
  }, []);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite }),
    [favorites, isFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
