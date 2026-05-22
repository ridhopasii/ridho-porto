import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({mode}) => ({
  base: '/',
  plugins: [
    // enable the inspect plugin only during development to avoid extra overhead in production builds
    ...(mode === 'development' ? [inspectAttr()] : []),
    react(),
    // include bundle visualizer when requested via env
    ...(process.env.VITE_ANALYZE ? [visualizer({ filename: 'dist/bundle-analysis.html', gzipSize: true })] : []),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
