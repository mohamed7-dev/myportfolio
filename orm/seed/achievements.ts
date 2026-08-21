import {
  AchievementType,
  type CreateAchievementInputSchema,
} from "@/lib/dto/achievement";
import { LanguageCode } from "@/lib/dto/language-code";

type SeedAchievement = Omit<
  CreateAchievementInputSchema,
  "assetIds" | "featuredAssetId"
> & {
  key: string;
  careerKey?: string;
};

export const achievementsSeed: SeedAchievement[] = [
  {
    key: "certificate-1",

    translations: [
      {
        languageCode: LanguageCode["en"],
        name: "Professional Certificate",
        slug: "professional-certificate",
        organization: "Organization Name",
      },
      {
        languageCode: LanguageCode["ar"],
        name: "شهادة مهنية",
        slug: "شهادة-مهنية",
        organization: "اسم المؤسسة",
      },
    ],

    type: AchievementType.CERTIFICATE,

    issueDate: new Date("2025-01-15"),

    credentialUrl: "https://example.com/certificates/credential-id",
  },
];
