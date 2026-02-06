/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  plugins: [react()],
  // The 'define' block has been removed to prevent API key exposure on the client.
  // API calls are now securely handled by the backend proxy.
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.ts", // setup file in the root
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
