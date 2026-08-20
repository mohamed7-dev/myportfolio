import type { CreateContactMethodInputSchema } from "@/lib/dto/contact-method";
import { LanguageCode } from "@/lib/dto/language-code";

type SeedContactMethod = Omit<
  CreateContactMethodInputSchema,
  "assetIds" | "featuredAssetId"
> & {
  key: string;
};

export const contactMethodsSeed: SeedContactMethod[] = [
  {
    key: "github",

    translations: [
      {
        languageCode: LanguageCode["ar-EG"],
        name: "جيت هب",
      },
      {
        languageCode: LanguageCode["en-US "],
        name: "GitHub",
      },
    ],

    url: "https://github.com/your-username",
    copyableText: undefined,

    enabled: true,
    primary: false,
  },

  {
    key: "linkedin",

    translations: [
      {
        languageCode: LanguageCode["ar-EG"],
        name: "لينكد إن",
      },
      {
        languageCode: LanguageCode["en-US "],
        name: "LinkedIn",
      },
    ],

    url: "https://www.linkedin.com/in/your-username",
    copyableText: undefined,

    enabled: true,
    primary: false,
  },

  {
    key: "mail",

    translations: [
      {
        languageCode: LanguageCode["ar-EG"],
        name: "البريد الإلكتروني",
      },
      {
        languageCode: LanguageCode["en-US "],
        name: "Email",
      },
    ],

    url: "mailto:your-email@example.com",
    copyableText: "your-email@example.com",

    enabled: true,
    primary: true,
  },
];
