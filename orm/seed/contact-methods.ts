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
        languageCode: LanguageCode["ar"],
        name: "جيت هب",
      },
      {
        languageCode: LanguageCode["en"],
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
        languageCode: LanguageCode["ar"],
        name: "لينكد إن",
      },
      {
        languageCode: LanguageCode["en"],
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
        languageCode: LanguageCode["ar"],
        name: "البريد الإلكتروني",
      },
      {
        languageCode: LanguageCode["en"],
        name: "Email",
      },
    ],

    url: "mailto:your-email@example.com",
    copyableText: "your-email@example.com",

    enabled: true,
    primary: true,
  },
];
