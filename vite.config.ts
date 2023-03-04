/// <reference types="vitest" />
import { defineConfig } from "vite";

const config = defineConfig({
  test: {
    environment: "happy-dom",
  },
});

export default config;
