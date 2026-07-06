import { HashRouter, Route, Routes } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Player from "./components/Player";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import LiveStations from "./pages/LiveStations";
import Categories from "./pages/Categories";
import Cities from "./pages/Cities";
import Favorites from "./pages/Favorites";

export default function App() {
  return (
    // HashRouter keeps deep links refresh-safe on GitHub Pages (no server
    // rewrite rules needed for a static host).
    <HashRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <FavoritesProvider>
        <PlayerProvider>
          <div className="app-bg" aria-hidden="true" />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink-800 focus:px-4 focus:py-2"
          >
            Skip to content
          </a>
          <ScrollToTop />
          <Navbar />
          <main id="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/live" element={<LiveStations />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/cities" element={<Cities />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
          <Player />
        </PlayerProvider>
      </FavoritesProvider>
    </HashRouter>
  );
}
