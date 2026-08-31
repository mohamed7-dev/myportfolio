import { resolve } from "node:path";
import { config } from "dotenv";
import { isDevelopmentMode } from "../utils/is-env";


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
