import type { NextConfig } from "next";

const nextConfig: NextConfig = {};
nextConfig.outputFileTracingIncludes = {
  "/*": ["./node_modules/swisseph-wasm/wasm/**/*"],
};
nextConfig.experimental = { agentUpgrade: "security" };

export default nextConfig;
