import {
  CareerMode,
  CareerType,
  type CreateCareerInputSchema,
} from "@/lib/dto/career";
import { LanguageCode } from "@/lib/dto/language-code";

type SeedCareer = Omit<
  CreateCareerInputSchema,
  "assetIds" | "featuredAssetId"
> & {
  key: string;
};

export const careersSeed: SeedCareer[] = [
  {
    key: "company-1",

    translations: [
      {
        languageCode: LanguageCode["en-US "],
        name: "Software Engineer",
        slug: "software-engineer",
        location: "Cairo, Egypt",
        organization: "Company Name",

        responsibilities: [
          "<ul>",
          "<li><p>Designed and developed responsive web applications using modern frontend technologies.</p></li>",
          "<li><p>Built reusable and maintainable UI components.</p></li>",
          "<li><p>Collaborated with other developers to design and implement application features.</p></li>",
          "<li><p>Worked on backend APIs and database integration.</p></li>",
          "<li><p>Improved application performance, accessibility, and user experience.</p></li>",
          "</ul>",
        ].join("\n"),

        impact: [
          "<ul>",
          "<li><p>Improved application maintainability through reusable components and consistent architectural patterns.</p></li>",
          "<li><p>Improved user experience through performance and accessibility optimizations.</p></li>",
          "<li><p>Contributed to delivering production-ready features from implementation through deployment.</p></li>",
          "</ul>",
        ].join("\n"),

        learned: [
          "<ul>",
          "<li><p>Developing production applications requires balancing technical quality with business requirements.</p></li>",
          "<li><p>Large applications benefit significantly from clear architectural boundaries and reusable abstractions.</p></li>",
          "<li><p>Effective collaboration and communication are as important as technical implementation.</p></li>",
          "</ul>",
        ].join("\n"),
      },
    ],

    startDate: new Date("2024-01-01"),
    endDate: null,
    isPresent: true,

    mode: CareerMode.ON_SITE,
    type: CareerType.FULL_TIME,
  },
];
