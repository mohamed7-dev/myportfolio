const messages = {
  nav: {
    home: "home",
    about: "about",
    career: "career",
    projects: "projects",
    achievements: "achievements",
    contact: "contact",
  },
  languages: {
    en: "english",
    ar: "arabic",
  },
  copyright: "{name} All rights reserved.",
  intro: "Hi, I'm {name}",
  jobTitle: "{title}",
  location: "Based in {location}",
  cv: "Download CV",
  subheading:
    "I build fast, thoughtful web experiences - from pixel-perfect UIs to rock-solid APIs. Next.js, Laravel, and a relentless obsession with craft.",
  subtitle: "Explore everything I've crafted, contributed, and accomplished.",
  cards: {
    stats: {
      title: "Quick Stats",
      experience: "Experience",
      projectsShipped: "Projects shipped",
      openSourceContributions: "Open source Contributions",
      years: "yrs",
    },
    currentFocus: {
      title: "Current focus",
    },
    projects: {
      title: "Featured Work",
      description: "A selection of real apps built to solve real problems.",
    },
    connect: {
      title: "connect",
    },
    about: {
      title: "About Me",
      description: "Who I am and what I do.",
    },
    skills: {
      title: "Skills & Tools",
      description: "Covering web, frontend, and backend technologies.",
    },
    achievements: {
      title: "Achievements",
      description: "Milestones from programs, projects, and communities.",
    },
    career: {
      title: "Career",
      description: "My professional journey and work experience.",
    },
    testimonials: {
      title: "Testimonials",
      description: "What clients and colleagues say about working with me.",
    },
  },
} as const;

export default messages;
