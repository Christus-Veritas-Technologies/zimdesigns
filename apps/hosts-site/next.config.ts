import path from "node:path";
import "./src/env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Trace files from the monorepo root so workspace node_modules are included
  outputFileTracingRoot: path.join(__dirname, "../../"),
  typedRoutes: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
