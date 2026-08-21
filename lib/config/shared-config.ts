import { LanguageCode } from "../dto/language-code";

interface SharedAppConfig {
  server: {
    port: number;
    host: string;
  };
  i18n: {
    locales: Array<{ key: LanguageCode }>;
    defaultLocale: LanguageCode;
  };
  asset: {
    sourceFileTypes: Record<
      string,
      { extensions: string[]; maxSizeInMb: number }
    >;
    previewFileTypes: Record<
      string,
      { extensions: string[]; maxSizeInMb: number }
    >;
  };
}

export const sharedConfig: SharedAppConfig = {
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    host: process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : `http://localhost:3000`,
  },
  i18n: {
    locales: [
      {
        key: LanguageCode["en"],
      },
      {
        key: LanguageCode["ar"],
      },
    ],
    defaultLocale: LanguageCode["en"],
  },
  asset: {
    sourceFileTypes: {
      "video/*": { extensions: [".mp4"], maxSizeInMb: 32 },
      "image/*": {
        extensions: [".png", ".jpeg", ".jpg", ".svg"],
        maxSizeInMb: 4,
      },
      "application/*": { extensions: [".pdf"], maxSizeInMb: 4 },
    },
    previewFileTypes: {
      "image/*": {
        extensions: [".png", ".jpeg", ".jpg", ".svg"],
        maxSizeInMb: 4,
      },
    },
  },
};
