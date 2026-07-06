import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base ("./") keeps asset URLs working on GitHub Pages project
// sites (e.g. https://<user>.github.io/<repo>/) without hardcoding the repo
// name. Combined with HashRouter this makes deep links refresh-safe.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
    // hls.js is a large but lazily-loaded chunk (fetched only on HLS playback).
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Split heavy libs into their own cacheable chunks for faster loads.
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
          icons: ["lucide-react"],
        },
      },
    },
  },
});
