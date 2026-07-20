import { Achievement } from "./achievement/achievement.entity";
import { AchievementAsset } from "./achievement/achievement-asset.entity";
import { Asset } from "./asset/asset.entity";
import { AssetTranslation } from "./asset/asset-translation.entity";
import { Career } from "./career/career.entity";
import { CareerAsset } from "./career/career-asset.entity";
import { ContactMethod } from "./contact-method/contact-method.entity";
import { Education } from "./education/education.entity";
import { EducationAsset } from "./education/education-asset.entity";
import { Profile } from "./profile/profile.entity";
import { ProfileAsset } from "./profile/profile-asset.entity";
import { ProfileTranslation } from "./profile/profile-translation.entity";
import { Project } from "./project/project.entity";
import { ProjectAsset } from "./project/project-asset.entity";
import { ProjectTranslation } from "./project/project-translation.entity";
import { Skill } from "./skill/skill.entity";
import { SkillAsset } from "./skill/skill-asset.entity";
import { Tag } from "./tag/tag.entity";

export const entitiesMap = {
  Project,
  ProjectAsset,
  ProjectTranslation,
  Profile,
  ProfileAsset,
  ProfileTranslation,
  Skill,
  SkillAsset,
  Asset,
  AssetTranslation,
  ContactMethod,
  Achievement,
  AchievementAsset,
  Career,
  CareerAsset,
  Education,
  EducationAsset,
  Tag,
};
