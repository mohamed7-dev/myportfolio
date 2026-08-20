import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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
    rootParams: true,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
