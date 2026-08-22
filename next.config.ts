import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "m48vtebflu.ufs.sh",
      },
      {
        hostname: "localhost",
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
    serverMinification: false,
  },
};

export default nextConfig;
