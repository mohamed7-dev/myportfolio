import { LanguageCode } from "@/lib/dto/language-code";
import { type CreateSkillInputSchema, SkillCategory } from "@/lib/dto/skill";

type SeedSkill = Omit<
  CreateSkillInputSchema,
  "assetIds" | "featuredAssetId"
> & {
  key: string;
};

export const skillsSeed: SeedSkill[] = [
  {
    key: "reactjs",

    translations: [
      {
        languageCode: LanguageCode["ar"],
        name: "ريأكت",
        slug: "ريأكت",
      },
      {
        languageCode: LanguageCode["en"],
        name: "React",
        slug: "reactjs",
      },
    ],

    category: SkillCategory.FRONTEND,
    isFeatured: true,
  },

  {
    key: "nodejs",

    translations: [
      {
        languageCode: LanguageCode["ar"],
        name: "نود.جي إس",
        slug: "نود-جي-إس",
      },
      {
        languageCode: LanguageCode["en"],
        name: "Node.js",
        slug: "nodejs",
      },
    ],

    category: SkillCategory.BACKEND,
    isFeatured: true,
  },

  {
    key: "figma",

    translations: [
      {
        languageCode: LanguageCode["ar"],
        name: "فيجما",
        slug: "فيجما",
      },
      {
        languageCode: LanguageCode["en"],
        name: "Figma",
        slug: "figma",
      },
    ],

    category: SkillCategory.TOOLS,
    isFeatured: false,
  },
];
