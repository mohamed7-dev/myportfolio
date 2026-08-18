import { LanguageCode } from "@/lib/dto/language-code";

export const profileSeed = {
  translations: [
    {
      languageCode: LanguageCode["en-US "],
      summary:
        "Software engineer focused on building reliable, accessible, and high-performance web applications. I work across frontend, backend, databases, and infrastructure to turn complex requirements into maintainable production systems.",
      displayName: "Mohamed Shaban",
      intro:
        "I build software with a strong focus on engineering fundamentals, clean architecture, and a great user experience.",
      subHeading: "Software Engineer building thoughtful digital experiences",
      subtitle:
        "Frontend-focused engineer with a growing focus on backend systems and infrastructure.",
      jobTitle: "Software Engineer",
      location: "Minya, Egypt",
      currentFocus:
        "<p><strong>Learning Back-end</strong> Building production-grade full-stack applications, deepening my backend and DevOps expertise, and improving performance, accessibility, and system architecture.</p>",
    },

    {
      languageCode: LanguageCode["ar-EG"],
      summary:
        "مهندس برمجيات أركز على بناء تطبيقات ويب موثوقة، سهلة الوصول، وعالية الأداء. أعمل على الواجهات الأمامية والخلفية وقواعد البيانات والبنية التحتية لتحويل المتطلبات المعقدة إلى أنظمة إنتاجية قابلة للصيانة.",
      displayName: "محمد شعبان",
      intro:
        "أبني البرمجيات مع التركيز على الأسس الهندسية السليمة، والهندسة المعمارية النظيفة، وتجربة المستخدم المتميزة.",
      subHeading: "مهندس برمجيات أبني تجارب رقمية مدروسة وعالية الجودة",
      subtitle:
        "مهندس يركز على تطوير الواجهات الأمامية مع اهتمام متزايد بالأنظمة الخلفية والبنية التحتية.",
      jobTitle: "مهندس برمجيات",
      location: "المنيا، مصر",
      currentFocus:
        "أعمل حاليًا على بناء تطبيقات متكاملة بمستوى إنتاجي، وتعميق خبرتي في تطوير الأنظمة الخلفية وDevOps، وتحسين الأداء وإمكانية الوصول والهندسة المعمارية للأنظمة.",
    },
  ],
  projectsShipped: 3,
  openSourceContributions: 1,
  yearsOfExperience: 1,
  handle: "mohamed-shaban",
};
