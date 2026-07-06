import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Menu, Radio, X } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/live", label: "Live Stations" },
  { to: "/categories", label: "Categories" },
  { to: "/cities", label: "Cities" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { favorites } = useFavorites();

  return (
    <header className="sticky top-0 z-40">
      <div className="glass border-b border-white/10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-saffron-500 via-white/90 to-indiagreen-500 shadow-glow">
              <Radio className="h-5 w-5 text-ink-900" />
            </span>
            <span className="font-display text-lg font-bold leading-none">
              India <span className="gradient-text">Live Radio</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/65 hover:text-white"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <NavLink
              to="/favorites"
              aria-label="Favorites"
              className={({ isActive }) =>
                `relative rounded-full p-2.5 transition ${
                  isActive ? "bg-white/10 text-red-400" : "text-white/70 hover:text-white"
                }`
              }
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold">
                  {favorites.length}
                </span>
              )}
            </NavLink>

            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="rounded-full p-2.5 text-white/80 md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden md:hidden"
            >
              <div className="flex flex-col gap-1 px-4 pb-4">
                {LINKS.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive ? "bg-white/10 text-white" : "text-white/70"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
