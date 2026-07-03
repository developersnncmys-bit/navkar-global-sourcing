import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — produces `out/` with pre-rendered HTML/CSS/JS that
  // Netlify serves as static files. Do not remove without updating
  // netlify.toml's `publish` directory.
  output: "export",
};

export default nextConfig;
