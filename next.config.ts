import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Firebase Admin is a Node-only server dependency. Keeping it external
  // prevents Next/Turbopack from bundling its CommonJS/ESM dependency tree.
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
