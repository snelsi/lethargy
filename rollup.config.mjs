import typescript from "@rollup/plugin-typescript";

import pkg from "./package.json" assert { type: "json" };

const createOutput = (config) => ({
  sourcemap: true,
  ...(config || {}),
});

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "esm",
    },
  ].map(createOutput),
  plugins: [typescript()],
};

export default config;
