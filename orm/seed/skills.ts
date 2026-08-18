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
        languageCode: LanguageCode["en-US "],
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
        languageCode: LanguageCode["en-US "],
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
        languageCode: LanguageCode["en-US "],
        name: "Figma",
        slug: "figma",
      },
    ],

    category: SkillCategory.TOOLS,
    isFeatured: false,
  },
];
