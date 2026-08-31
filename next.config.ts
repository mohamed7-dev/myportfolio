import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
      },
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },

  serverExternalPackages: ["typeorm"],
  turbopack: {
    resolveAlias: {
      "expo-sqlite": "./mock-empty.js",
      "react-native-sqlite-storage": "./mock-empty.js",
      "sql.js": "./mock-empty.js",
      oracle: "./mock-empty.js",
      mssql: "./mock-empty.js",
    },
  },
  experimental: {
    inlineCss: true,
    optimizePackageImports: ["radix-ui"],
    serverMinification: false,
  },
};

export default nextConfig;
