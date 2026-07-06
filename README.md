# India — Live Radio 🎧🇮🇳

A modern, production-ready live Indian radio streaming platform. Listen to
hundreds of live FM & online stations from across India, browse by language and
city, search instantly, and save favorites — all in a sleek glassmorphism UI.

Built with **React + Vite + TypeScript**, **Tailwind CSS**, **Framer Motion**,
and **hls.js**, powered by the community [radio-browser.info](https://www.radio-browser.info) API.

## ✨ Features

- **Homepage** — animated aurora hero, featured stations carousel, live "Now
  Playing" panel (logo, name, listener count, red-pulse live indicator), and
  quick language categories.
- **Station directory** — grid/list views, instant search, and filters by
  language, genre, and popularity.
- **Persistent audio player** — play/pause, volume, mute, share, dynamic
  artwork, and a live equalizer animation.
- **Robust live streaming** — HTML5 audio with **HLS/M3U8** support (hls.js),
  automatic reconnect with backoff, buffering indicators, and error handling.
- **Pages** — Home, Live Stations, Categories (by language), City-wise
  Stations, and Favorites.
- **Design** — glassmorphism, Indian tricolor-inspired gradients, smooth Framer
  Motion animations, fully responsive (mobile / tablet / desktop), keyboard
  accessible, and Media Session (lock-screen) controls.
- **Offline-friendly** — bundled sample stations (Radio Mirchi, Red FM, Big FM,
  AIR FM Gold/Rainbow, Fever FM, Radio City, Ishq FM, Club FM, Vividh Bharati)
  guarantee the UI is always populated even if the API is unavailable.

## 🚀 Getting started

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # type-check + production build to /dist
npm run preview  # preview the production build locally
```

Requires Node 18+.

## 🌐 Deploy to GitHub Pages

This project is configured for GitHub Pages out of the box:

- `vite.config.ts` uses a **relative base** (`base: "./"`) so assets resolve
  correctly on project sites (`https://<user>.github.io/<repo>/`).
- The app uses **HashRouter**, so deep links and refreshes work on a static
  host with no server rewrites.
- `public/.nojekyll` prevents Jekyll from stripping asset folders.

### Automatic (recommended)

1. Push the **contents of this `india-radio` folder** to a GitHub repo (this
   folder is the repo root — `package.json` and `.github/` sit at the top).
2. In the repo: **Settings → Pages → Build and deployment → Source →
   GitHub Actions**.
3. Push to `main`. The included workflow
   (`.github/workflows/deploy.yml`) builds and deploys automatically.

### Manual

```bash
npm run build
# then publish the dist/ folder, e.g. with the gh-pages package:
npx gh-pages -d dist
```

## 🧱 Tech stack

| Concern       | Choice                       |
| ------------- | ---------------------------- |
| Framework     | React 18 + Vite 5            |
| Language      | TypeScript                   |
| Styling       | Tailwind CSS 3               |
| Animation     | Framer Motion                |
| Streaming     | hls.js + HTML5 Audio         |
| Icons         | lucide-react                 |
| Routing       | react-router-dom (HashRouter)|
| Data          | radio-browser.info REST API  |

## 📝 Notes

- Radio stream URLs belong to their respective broadcasters. Availability of
  any given station depends on the broadcaster and the community database.
- Favorites are stored in `localStorage` on the user's device.
