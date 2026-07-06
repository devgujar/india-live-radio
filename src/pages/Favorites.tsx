import { Link } from "react-router-dom";
import { HeartCrack } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import StationGrid from "../components/StationGrid";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-40 pt-10 sm:px-6">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Your <span className="gradient-text">favorites</span>
        </h1>
        <p className="mt-2 text-white/60">
          {favorites.length
            ? `${favorites.length} station${favorites.length > 1 ? "s" : ""} saved on this device.`
            : "Save stations to build your personal lineup."}
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="glass flex flex-col items-center gap-4 rounded-2xl px-6 py-20 text-center">
          <HeartCrack className="h-12 w-12 text-white/30" />
          <p className="text-white/60">
            No favorites yet. Tap the heart on any station to save it here.
          </p>
          <Link to="/live" className="btn-primary px-6 py-3">
            Discover stations
          </Link>
        </div>
      ) : (
        <StationGrid stations={favorites} />
      )}
    </div>
  );
}
