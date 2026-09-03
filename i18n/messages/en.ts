export default {
  loading: "Loading",
  present: "Present",
  featured: "Featured",
  previous: "Previous",
  next: "Next",
  downloadFile: "download file",
  cookieConsent: {
    title: "Allow preference cookies?",
    description:
      "Used to remember your accent color and theme preferences on this device.",
    agree: "agree",
    reject: "reject",
  },
  mediaGallery: {
    dialogTitle: "Media gallery",
    dialogDescription: "Media gallery",
  },
  defaultNotFoundPage: {
    title: "Page not found",
    description:
      "The page you're looking for doesn't exist or may have been moved.",
    linkLabel: "Go home",
  },
  defaultErrorPage: {
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try again.",
    actionLabel: "Try again",
  },
  home: {
    location: "Based in {location}",
    cv: "Download CV",
    connect: "Connect",
    welcome: "welcome",
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
      career: {
        title: "Career",
        description: "My professional journey and work experience.",
      },
    },
  },
  about: {
    title: "about me",
    description:
      "Learn about my engineering mindset, technical skills, and professional background.",
    summary: {
      title: "The Architect Mindset",
    },
    skills: {
      title: "The technical arsenal",
      categories: {
        frontend: "front end",
        backend: "back end",
        tools: "tools",
        programmingLanguages: "programming languages",
      },
    },
    mediaGallery: {
      title: "Media Gallery",
    },
  },
  projects: {
    title: "engineering showcase",
    description: "Explore the applications and systems I have built.",
  },
  project: {
    backToProjects: "Back To Projects",
    source: "source",
    liveDemo: "live demo",
    relations: {
      title: "Project Relations",
      techStack: "Tech Stack",
      career: "career",
      education: "education",
      achievements: "achievements",
      careerMessage: "Built during",
      educationMessage: "While studying in",
    },
    summary: { title: "Overview" },
    features: { title: "Features" },
    techStack: { title: "Tech Stack" },
    challenges: { title: "Technical Challenges" },
    technicalHighlights: { title: "Technical Highlights" },
    contributions: { title: "contributions" },
    execution: {
      title: "execution",
      production: "in production",
      development: "in development",
      status: "status",
    },
  },
  contact: {
    title: "Get in touch",
    description:
      "I'm always open to discussing technical architecture roles, innovative projects, or opportunities to collaborate. Reach out via your preferred channel.",
    contactMethods: {
      title: "Contact Methods",
      goTo: "Visit",
      primary: "primary",
      primaryDescription: "For serious inquiries and formal communications.",
      copiedToClipboard:
        "Contact method was successfully copied to the clipboard",
    },
    directMessage: {
      title: "Direct message",
      form: {
        fullName: {
          label: "Full Name",
          description: "Enter your full name",
        },
        email: {
          label: "Email Address",
          description: "Enter your email address",
        },
        subject: {
          label: "Subject",
          description:
            "Example: Job Opportunity: Senior full-stack web developer",
        },
        content: {
          label: "Content",
          description: "Tell me about your project..",
        },
        submit: {
          label: "Send a Message",
          emailSuccess: "Email sent successfully",
          emailError:
            "Something went wrong while sending the email. choose another contact method if possible",
        },
      },
    },
  },
  achievements: {
    title: "Milestones & Recognition",
    description:
      "A curated timeline of professional certifications, industry awards, open-source contributions, and speaking engagements that define my technical journey.",
    types: {
      certificate: "certification",
      course: "course",
      internship: "internship",
    },
    verifyCredentialsLabel: "Verify Credentials",
    issuedAt: "Issued at",
  },
  career: {
    title: "Professional Odyssey",
    description:
      "A chronological map of my engineering career, highlighting architectural transitions, technical leadership, and system-scale impact across various technology ecosystems.",
    careerCard: {
      impact: "Technical Impact",
      learned: "What I Learned",
    },
    educationBlock: {
      title: "Education",
    },
    careerType: {
      fullTime: "full time",
      partTime: "part time",
      freelance: "freelance",
      internship: "internship",
      training: "training",
      contract: "contract",
      openSource: "open source contribution",
    },
    careerMode: {
      onSite: "on site",
      remote: "remote",
    },
  },
  publicLayout: {
    copyright: "All rights reserved.",
    nav: {
      home: "home",
      about: "about",
      career: "career",
      projects: "projects",
      achievements: "achievements",
      contact: "contact",
    },
  },
} as const;
