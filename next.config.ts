import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // Helps Turbopack locate the WASM file inside node_modules
      "swisseph.wasm": "./node_modules/swisseph-wasm/dist/swisseph.wasm",
    },
  },
};

export default nextConfig;
