import { LanguageCode } from "./dto/language-code";

export const NEW_ENTITY_PATH = "new";
export const DEFAULT_ENTITY_TRANSLATION_LANGUAGE_CODE: LanguageCode =
  LanguageCode["en"];
export const TRANSACTION_MANAGER_KEY = Symbol("TRANSACTION_MANAGER");
export const ACCENT_COLOR_CLASSNAME_KEY = "accent-color";
export const PREFERENCES_CONSENT_KEY = "preferences-consent";

export const cacheKeys = {
  publicSuperAdminProfile: ["superadmin-profile"],
  publicFeaturedSkills: ["featured-skills"],
  publicFeaturedProjects: ["featured-projects"],
  publicFeaturedCareers: ["featured-careers"],
  publicSkills: ["skills"],
  publicAchievements: ["achievements"],
  publicCareers: ["careers"],
  publicEducation: ["education-list"],
  publicContactMethods: ["contact-methods"],
  publicProjects: ["projects"],
  publicProject: ["project"],
};
