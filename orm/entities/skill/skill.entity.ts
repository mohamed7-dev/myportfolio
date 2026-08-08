import {
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import type { SkillCategory } from "@/lib/dto/skill";
import type { DeepPartial } from "@/lib/types/shared-types";
import type {
  LocaleString,
  Translatable,
  TranslationEntity,
} from "@/lib/types/translatable";
import { AppEntity } from "../app-entity";
import { Asset } from "../asset/asset.entity";
import { Project } from "../project/project.entity";
import type { SkillAsset } from "./skill-asset.entity";
import type { SkillTranslation } from "./skill-translation.entity";

@Entity()
export class Skill extends AppEntity implements Translatable {
  constructor(input?: DeepPartial<Skill>) {
    super();
    this.initialize(input);
  }

  name: LocaleString;

  slug: LocaleString;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: "varchar" })
  category: SkillCategory;

  @OneToMany("SkillAsset", (skillAsset: SkillAsset) => skillAsset.skill)
  assets: SkillAsset[];

  @Index()
  @ManyToOne(
    () => Asset,
    (asset) => asset.featuredInSkills,
    { onDelete: "SET NULL" },
  )
  featuredAsset: Asset;

  @OneToMany(
    "SkillTranslation",
    (translation: SkillTranslation) => translation.base,
    { eager: true },
  )
  translations: TranslationEntity<SkillTranslation>[];

  @ManyToMany(
    () => Project,
    (project) => project.skills,
  )
  projects: Project[];
}
