import { Radio, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-saffron-500 via-white/90 to-indiagreen-500">
              <Radio className="h-4.5 w-4.5 text-ink-900" />
            </span>
            <span className="font-display text-base font-bold">
              India <span className="gradient-text">Live Radio</span>
            </span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/55">
            Stream live Indian FM & online radio from across the country — by
            language, city and genre. Powered by the community-run
            radio-browser.info database.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="mb-3 font-semibold text-white/90">Explore</h4>
            <ul className="space-y-2 text-white/55">
              <li><Link to="/live" className="hover:text-white">Live Stations</Link></li>
              <li><Link to="/categories" className="hover:text-white">Categories</Link></li>
              <li><Link to="/cities" className="hover:text-white">Cities</Link></li>
              <li><Link to="/favorites" className="hover:text-white">Favorites</Link></li>
              <li><Link to="/about" className="hover:text-white">About Me</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-white/90">Data</h4>
            <ul className="space-y-2 text-white/55">
              <li>
                <a
                  href="https://www.radio-browser.info"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  radio-browser.info
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-sm text-white/55 md:text-right">
          <p className="flex items-center gap-1.5 md:justify-end">
            Made with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> in India
          </p>
          <p className="mt-2">© {new Date().getFullYear()} India - Live Radio</p>
          <p className="mt-1 text-xs text-white/35">
            Station streams are property of their respective broadcasters.
          </p>
        </div>
      </div>
    </footer>
  );
}
