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
        languageCode: LanguageCode["ar"],
        name: "مهندس برمجيات",
        slug: "مهندس-برمجيات",
        location: "القاهرة، مصر",
        organization: "اسم الشركة",

        responsibilities: [
          "<ul>",
          "<li><p>تصميم وتطوير تطبيقات ويب متجاوبة باستخدام تقنيات الواجهة الأمامية الحديثة.</p></li>",
          "<li><p>بناء مكونات واجهة مستخدم قابلة لإعادة الاستخدام وسهلة الصيانة.</p></li>",
          "<li><p>التعاون مع المطورين الآخرين لتصميم وتنفيذ ميزات التطبيق.</p></li>",
          "<li><p>العمل على واجهات برمجة التطبيقات الخلفية وتكامل قواعد البيانات.</p></li>",
          "<li><p>تحسين أداء التطبيق وإمكانية الوصول وتجربة المستخدم.</p></li>",
          "</ul>",
        ].join("\n"),

        impact: [
          "<ul>",
          "<li><p>تحسين قابلية صيانة التطبيق من خلال المكونات القابلة لإعادة الاستخدام وأنماط البنية المعمارية المتسقة.</p></li>",
          "<li><p>تحسين تجربة المستخدم من خلال تحسينات الأداء وإمكانية الوصول.</p></li>",
          "<li><p>المساهمة في تقديم ميزات جاهزة للإنتاج بدءًا من التنفيذ وحتى النشر.</p></li>",
          "</ul>",
        ].join("\n"),

        learned: [
          "<ul>",
          "<li><p>يتطلب تطوير تطبيقات الإنتاج تحقيق توازن بين الجودة التقنية ومتطلبات العمل.</p></li>",
          "<li><p>تستفيد التطبيقات الكبيرة بشكل كبير من الحدود المعمارية الواضحة والتجريدات القابلة لإعادة الاستخدام.</p></li>",
          "<li><p>التعاون والتواصل الفعالان لا يقلان أهمية عن التنفيذ التقني.</p></li>",
          "</ul>",
        ].join("\n"),
      },
      {
        languageCode: LanguageCode["en"],
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
    isFeatured: true,

    mode: CareerMode.ON_SITE,
    type: CareerType.FULL_TIME,
  },
];
