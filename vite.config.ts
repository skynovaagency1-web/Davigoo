import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Multi-page build: the marketing site, the interactive prototype, the legal page and the staff ops console.
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        app: path.resolve(__dirname, "app.html"),
        legal: path.resolve(__dirname, "mentions-legales.html"),
        ops: path.resolve(__dirname, "ops/index.html"),
      },
    },
  },
});
