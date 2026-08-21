import { resolve } from "node:path";
import { config } from "dotenv";

export const isDevelopmentMode = () => {
  return process.env.NODE_ENV === "development";
};

export const isProductionMode = () => {
  return process.env.NODE_ENV === "production";
};

export function requireEnv(name: string | undefined): string {
  const value = process.env[name as string];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export function registerEnv() {
  config({
    path: [
      resolve(process.cwd(), ".env.local"),
      isDevelopmentMode()
        ? resolve(process.cwd(), ".env.development")
        : resolve(process.cwd(), ".env.production"),
    ],
  });
}
