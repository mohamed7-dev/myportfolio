import { LanguageCode } from "../dto/language-code";

interface SharedAppConfig {
  api: {
    languageCodeHeaderName: string;
    authTokenCookieName: string;
  };
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
  api: {
    languageCodeHeaderName: "X-languageCode",
    authTokenCookieName: "session-token",
  },
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    host: process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}`
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
