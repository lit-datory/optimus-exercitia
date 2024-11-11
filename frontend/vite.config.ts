/// <reference types="vitest" />
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [react(), tsconfigPaths(), svgr()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setupTests.ts"],
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
    hmr: {
      port: 3010,
    },
  },
})
