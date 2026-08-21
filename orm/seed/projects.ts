import { LanguageCode } from "@/lib/dto/language-code";
import type { CreateProjectInputSchema } from "@/lib/dto/project";

type SeedProject = Omit<
  CreateProjectInputSchema,
  "assetIds" | "featuredAssetId" | "skillIds"
> & {
  key: string;
  skillKeys: string[];
  careerKey?: string;
  educationKey?: string;
  achievementKeys?: string[];
};

export const projectsSeed: SeedProject[] = [
  {
    key: "vidora",
    translations: [
      {
        languageCode: LanguageCode["ar"],
        name: "فيدورا",
        slug: "فيدورا",
        description:
          "تطبيق وسائط مكتبي لتنزيل وإدارة مقاطع الفيديو عبر الإنترنت.",

        overview:
          "<p>فيدورا هو تطبيق مكتبي مبني على yt-dlp، ويوفر واجهة سهلة لتنزيل وإدارة الوسائط المتاحة عبر الإنترنت.</p>",

        features: [
          "<ul>",
          "<li><p>تنزيل الوسائط</p></li>",
          "<li><p>اختيار صيغ الفيديو والصوت</p></li>",
          "<li><p>إدارة التنزيلات</p></li>",
          "<li><p>تطبيق مكتبي</p></li>",
          "<li><p>دعم تعدد اللغات</p></li>",
          "</ul>",
        ].join("\n"),

        technicalHighlights: [
          "<ul>",
          "<li><p>بنية تطبيقات سطح المكتب باستخدام Electron</p></li>",
          "<li><p>مكونات الويب (Web Components)</p></li>",
          "<li><p>التكامل مع yt-dlp</p></li>",
          "<li><p>أدوات مخصصة لدعم تعدد اللغات</p></li>",
          "</ul>",
        ].join("\n"),

        contributions: [
          "<ul>",
          "<li><p>تصميم وتنفيذ بنية التطبيق</p></li>",
          "<li><p>واجهة المستخدم</p></li>",
          "<li><p>سير عمل تنزيل الوسائط</p></li>",
          "<li><p>الأدوات المساندة</p></li>",
          "</ul>",
        ].join("\n"),

        challengesAndSolutions: [
          "<ul>",
          "<li><p>كان التطبيق بحاجة إلى تنسيق واجهة سطح المكتب مع عملية خارجية لتنزيل الوسائط، مع الحفاظ على استجابة الواجهة.</p></li>",
          "<li><p>تفصل البنية المعمارية بين واجهة المستخدم وطبقة معالجة الوسائط، ويتم التواصل بينهما من خلال حدود واضحة ومحددة.</p></li>",
          "</ul>",
        ].join("\n"),

        techStack: [
          "<ul>",
          "<li><p><strong>الواجهة الأمامية: </strong> Electron وWeb Components وTypeScript</p></li>",
          "<li><p><strong>الأدوات: </strong> yt-dlp وffmpeg</p></li>",
          "</ul>",
        ].join("\n"),
      },
      {
        languageCode: LanguageCode["en"],
        name: "Vidora",
        slug: "vidora",
        description:
          "A desktop media application for downloading and managing online videos.",

        overview:
          "<p>Vidora is a desktop application built around yt-dlp that provides a convenient interface for downloading and managing online media.</p>",

        features: [
          "<ul>",
          "<li><p>Media downloading</p></li>",
          "<li><p>Video and audio format selection</p></li>",
          "<li><p>Download management</p></li>",
          "<li><p>Desktop application</p></li>",
          "<li><p>Internationalization support</p></li>",
          "</ul>",
        ].join("\n"),

        technicalHighlights: [
          "<ul>",
          "<li><p>Electron desktop architecture</p></li>",
          "<li><p>Web Components</p></li>",
          "<li><p>yt-dlp integration</p></li>",
          "<li><p>Custom internationalization tooling</p></li>",
          "</ul>",
        ].join("\n"),

        contributions: [
          "<ul>",
          "<li><p>Designed and implemented the application architecture</p></li>",
          "<li><p>UI</p></li>",
          "<li><p> media downloading workflow</p></li>",
          "<li><p>supporting tooling</p></li>",
          "</ul>",
        ].join("\n"),

        challengesAndSolutions: [
          "<ul>",
          "<li><p>The application needed to coordinate a desktop UI with an external media downloading process while keeping the interface responsive</p></li>",
          "<li><p>The architecture separates the UI from the media-processing layer and communicates through well-defined boundaries.</p></li>",
          "</ul>",
        ].join("\n"),

        techStack: [
          "<ul>",
          "<li><p><strong>Front end: </strong> Electron, Web Components, and Typescript</p></li>",
          "<li><p><strong>Tools: </strong> yt-dlp, and ffmpeg</p></li>",
          "</ul>",
        ].join("\n"),
      },
    ],

    liveDemoUrl: "http://localhost:3000",
    repoUrl: "http://localhost:3000",

    enabled: true,
    finished: true,
    featured: true,

    skillKeys: ["figma", "nodejs"],
    careerKey: "company-1",
    educationKey: "university-1",
    achievementKeys: ["certificate-1"],
  },
  {
    key: "snippetly",
    translations: [
      {
        languageCode: LanguageCode["ar"],
        name: "سنيبتلي",
        slug: "سنيبتلي",

        description:
          "تطبيق جاهز للعمل دون اتصال بالإنترنت لتخزين وتنظيم وإدارة مقتطفات الأكواد القابلة لإعادة الاستخدام.",

        overview: [
          "<p>سنيبتلي هو تطبيق ويب مصمم لتسهيل تخزين وإدارة مقتطفات الأكواد القابلة لإعادة الاستخدام والوصول إليها.</p>",
          "<p>يوفر التطبيق تجربة جاهزة للعمل دون اتصال بالإنترنت، مما يسمح للمستخدمين بالاستمرار في العمل على مقتطفاتهم حتى عند عدم توفر اتصال بالشبكة.</p>",
        ].join("\n"),

        features: [
          "<ul>",
          "<li><p>إدارة مقتطفات الأكواد</p></li>",
          "<li><p>تنظيم مقتطفات الأكواد</p></li>",
          "<li><p>تجربة جاهزة للعمل دون اتصال بالإنترنت</p></li>",
          "<li><p>التخزين المحلي باستخدام IndexedDB</p></li>",
          "<li><p>واجهة مستخدم متجاوبة</p></li>",
          "</ul>",
        ].join("\n"),

        technicalHighlights: [
          "<ul>",
          "<li><p>بنية واجهة أمامية مبنية باستخدام React</p></li>",
          "<li><p>خلفية مبنية باستخدام Node.js وExpress</p></li>",
          "<li><p>تخزين البيانات باستخدام PostgreSQL</p></li>",
          "<li><p>استخدام Drizzle ORM</p></li>",
          "<li><p>استخدام IndexedDB للتخزين على جانب العميل</p></li>",
          "<li><p>بنية عميل تعتمد على نهج العمل دون اتصال بالإنترنت أولًا</p></li>",
          "</ul>",
        ].join("\n"),

        contributions: [
          "<ul>",
          "<li><p>تصميم وتنفيذ بنية الواجهة الأمامية</p></li>",
          "<li><p>تصميم وتنفيذ واجهة برمجة التطبيقات الخلفية</p></li>",
          "<li><p>تنفيذ طبقة تخزين البيانات باستخدام PostgreSQL</p></li>",
          "<li><p>تنفيذ تجربة العميل الجاهزة للعمل دون اتصال بالإنترنت</p></li>",
          "<li><p>تصميم استراتيجية التخزين باستخدام IndexedDB</p></li>",
          "</ul>",
        ].join("\n"),

        challengesAndSolutions: [
          "<ul>",
          "<li><p>كان التطبيق بحاجة إلى الحفاظ على فائدته حتى عند عدم توفر اتصال بالشبكة.</p></li>",
          "<li><p>يسمح التخزين على جانب العميل باستخدام IndexedDB للمستخدمين بالاستمرار في العمل على مقتطفاتهم محليًا، مع توفير أساس للمزامنة عند استعادة الاتصال بالشبكة.</p></li>",
          "</ul>",
        ].join("\n"),

        techStack: [
          "<ul>",
          "<li><p><strong>الواجهة الأمامية: </strong> React وTypeScript وIndexedDB</p></li>",
          "<li><p><strong>الخلفية: </strong> Node.js وExpress</p></li>",
          "<li><p><strong>قاعدة البيانات: </strong> PostgreSQL</p></li>",
          "<li><p><strong>ORM: </strong> Drizzle ORM</p></li>",
          "</ul>",
        ].join("\n"),
      },
      {
        languageCode: LanguageCode["en"],
        name: "Snippetly",
        slug: "snippetly",

        description:
          "An offline-ready application for storing, organizing, and managing reusable code snippets.",

        overview: [
          "<p>Snippetly is a web application designed to make storing and managing reusable code snippets simple and accessible.</p>",
          "<p>It provides an offline-ready experience, allowing users to continue working with their snippets even when network connectivity is unavailable.</p>",
        ].join("\n"),

        features: [
          "<ul>",
          "<li><p>Code snippet management</p></li>",
          "<li><p>Snippet organization</p></li>",
          "<li><p>Offline-ready experience</p></li>",
          "<li><p>Local IndexedDB persistence</p></li>",
          "<li><p>Responsive user interface</p></li>",
          "</ul>",
        ].join("\n"),

        technicalHighlights: [
          "<ul>",
          "<li><p>React-based frontend architecture</p></li>",
          "<li><p>Node.js and Express backend</p></li>",
          "<li><p>PostgreSQL persistence</p></li>",
          "<li><p>Drizzle ORM</p></li>",
          "<li><p>IndexedDB for client-side persistence</p></li>",
          "<li><p>Offline-first client architecture</p></li>",
          "</ul>",
        ].join("\n"),

        contributions: [
          "<ul>",
          "<li><p>Designed and implemented the frontend architecture</p></li>",
          "<li><p>Designed and implemented the backend API</p></li>",
          "<li><p>Implemented the PostgreSQL persistence layer</p></li>",
          "<li><p>Implemented the offline-ready client experience</p></li>",
          "<li><p>Designed the IndexedDB persistence strategy</p></li>",
          "</ul>",
        ].join("\n"),

        challengesAndSolutions: [
          "<ul>",
          "<li><p>The application needed to remain useful when network connectivity was unavailable.</p></li>",
          "<li><p>Client-side persistence through IndexedDB allows users to continue working with their snippets locally while providing a foundation for synchronization when connectivity is restored.</p></li>",
          "</ul>",
        ].join("\n"),

        techStack: [
          "<ul>",
          "<li><p><strong>Front end: </strong> React, TypeScript, and IndexedDB</p></li>",
          "<li><p><strong>Back end: </strong> Node.js and Express</p></li>",
          "<li><p><strong>Database: </strong> PostgreSQL</p></li>",
          "<li><p><strong>ORM: </strong> Drizzle ORM</p></li>",
          "</ul>",
        ].join("\n"),
      },
    ],

    liveDemoUrl: "http://localhost:3000",
    repoUrl: "http://localhost:3000",

    enabled: true,
    finished: true,
    featured: false,

    skillKeys: ["reactjs", "nodejs"],
    educationKey: "university-1",
  },
];
