import type { CreateEducationInputSchema } from "@/lib/dto/education";
import { LanguageCode } from "@/lib/dto/language-code";

type SeedEducation = Omit<
  CreateEducationInputSchema,
  "assetIds" | "featuredAssetId"
> & {
  key: string;
};

export const educationSeed: SeedEducation[] = [
  {
    key: "university-1",
    translations: [
      {
        languageCode: LanguageCode["ar"],
        school: "جامعة المنيا",
        slug: "جامعة-المنيا",
        degree: "بكالوريوس الطب والجراحة",
        location: "المنيا، مصر",
      },
      {
        languageCode: LanguageCode["en"],
        school: "Minya University",
        slug: "minya-university",
        degree: "Bachelor of Medicine and Surgery",
        location: "Minya, Egypt",
      },
    ],
    startDate: new Date("2019-10-01"),
    endDate: new Date("2026-06-01"),
    isPresent: false,
    gpa: null,
  },
];
