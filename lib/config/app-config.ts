import type { LanguageCode } from "../dto/language-code";

interface AppConfig {
  defaultLanguageCode: LanguageCode;
  listQueryLimit: number;
}

export const appConfig: AppConfig = {
  defaultLanguageCode: "en",
  listQueryLimit: 100,
};

// TODO: change
export const port = process.env.PORT || 3000;
export const host = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : `http://localhost:${port}`;
