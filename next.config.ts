import type { NextConfig } from "next";

const nextConfig: NextConfig = {};
nextConfig.outputFileTracingIncludes = {
  "/*": ["./node_modules/swisseph-wasm/wasm/**/*"],
};

export default nextConfig;
