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
        languageCode: LanguageCode["en-US "],
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
          "</ul>",
          "<ul>",
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
        languageCode: LanguageCode["en-US "],
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
