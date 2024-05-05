/// <reference types="vitest" />
import { defineConfig } from "vite";

const config = defineConfig({
  test: {
    environment: "happy-dom",
    coverage: {
      exclude: ["**/example", "**/lib"],
    },
  },
});

export default config;
