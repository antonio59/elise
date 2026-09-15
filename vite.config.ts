import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5000,
  },
  preview: {
    port: 5000,
  },
  build: {
    sourcemap: "hidden",
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-router-dom")
          ) {
            return "vendor-react";
          }
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-framer";
          }
          if (
            id.includes("components/Login") ||
            id.includes("components/Signup")
          ) {
            return "feature-auth";
          }
          if (
            id.includes("components/Dashboard") ||
            id.includes("pages/Dashboard")
          ) {
            return "feature-admin";
          }
        },
      },
    },
  },
});
