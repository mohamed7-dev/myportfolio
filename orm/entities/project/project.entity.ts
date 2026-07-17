import {
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import type {
  LocaleString,
  Translatable,
  TranslationEntity,
} from "@/lib/types/translatable";
import { Achievement } from "../achievement/achievement.entity";
import { AppEntity } from "../app-entity";
import { Asset } from "../asset/asset.entity";
import { Career } from "../career/career.entity";
import { Education } from "../education/education.entity";
import type { ProjectAsset } from "./project-asset.entity";
import type { ProjectTranslation } from "./project-translation.entity";

@Entity()
export class Project extends AppEntity implements Translatable {
  constructor(input?: DeepPartial<Project>) {
    super();
    this.initialize(input);
  }

  name: LocaleString;

  slug: LocaleString;

  description: LocaleString;

  overview: LocaleString;

  features: LocaleString;

  technicalHighlights: LocaleString;

  contributions: LocaleString;

  challengesAndSolutions: LocaleString;

  techStack: LocaleString;

  @Column()
  liveDemoUrl: string;

  @Column()
  repoUrl: string;

  @Column({ default: true })
  enabled: boolean;

  @OneToMany(
    "ProjectTranslation",
    (translations: ProjectTranslation) => translations.base,
    { eager: true },
  )
  translations: TranslationEntity<ProjectTranslation>[];

  @OneToMany(
    "ProjectAsset",
    (projectAsset: ProjectAsset) => projectAsset.project,
  )
  assets: ProjectAsset[];

  @Index()
  @ManyToOne(
    () => Asset,
    (asset) => asset.featuredInProjects,
    { onDelete: "SET NULL" },
  )
  featuredAsset: Asset;

  @ManyToOne(
    () => Career,
    (career) => career.projects,
    { nullable: true },
  )
  career?: Career | null;

  @ManyToOne(
    () => Education,
    (edu) => edu.projects,
    { nullable: true },
  )
  education?: Education | null;

  @ManyToMany(
    () => Achievement,
    (achievement) => achievement.projects,
  )
  achievements: Achievement[];
}
