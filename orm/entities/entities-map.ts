import { Achievement } from "./achievement/achievement.entity";
import { AchievementAsset } from "./achievement/achievement-asset.entity";
import { AchievementTranslation } from "./achievement/achievement-translation.entity";
import { Asset } from "./asset/asset.entity";
import { AssetTranslation } from "./asset/asset-translation.entity";
import { AssetUpload } from "./asset-upload/asset-upload.entity";
import { Career } from "./career/career.entity";
import { CareerTranslation } from "./career/career.translation";
import { CareerAsset } from "./career/career-asset.entity";
import { ContactMethod } from "./contact-method/contact-method.entity";
import { ContactMethodAsset } from "./contact-method/contact-method-asset.entity";
import { ContactMethodTranslation } from "./contact-method/contact-method-translation.entity";
import { Education } from "./education/education.entity";
import { EducationAsset } from "./education/education-asset.entity";
import { EducationTranslation } from "./education/education-translation.entity";
import { Profile } from "./profile/profile.entity";
import { ProfileAsset } from "./profile/profile-asset.entity";
import { ProfileTranslation } from "./profile/profile-translation.entity";
import { Project } from "./project/project.entity";
import { ProjectAsset } from "./project/project-asset.entity";
import { ProjectTranslation } from "./project/project-translation.entity";
import { Session } from "./session/session.entity";
import { Skill } from "./skill/skill.entity";
import { SkillAsset } from "./skill/skill-asset.entity";
import { SkillTranslation } from "./skill/skill-translation.entity";
import { Tag } from "./tag/tag.entity";

export const entitiesMap = {
  Project,
  ProjectAsset,
  ProjectTranslation,
  Profile,
  ProfileAsset,
  ProfileTranslation,
  Session,
  Skill,
  SkillAsset,
  SkillTranslation,
  Asset,
  AssetTranslation,
  ContactMethod,
  ContactMethodAsset,
  ContactMethodTranslation,
  Achievement,
  AchievementAsset,
  AchievementTranslation,
  Career,
  CareerAsset,
  CareerTranslation,
  Education,
  EducationAsset,
  EducationTranslation,
  Tag,
  AssetUpload,
};
