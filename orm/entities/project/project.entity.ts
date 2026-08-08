import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import type { SoftDeletable } from "@/lib/types/soft-deletable";
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
import { Skill } from "../skill/skill.entity";
import type { ProjectAsset } from "./project-asset.entity";
import type { ProjectTranslation } from "./project-translation.entity";

@Entity()
export class Project extends AppEntity implements Translatable, SoftDeletable {
  constructor(input?: DeepPartial<Project>) {
    super();
    this.initialize(input);
  }

  @Column({ type: "date", nullable: true })
  deletedAt: Date | null;

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

  @Column()
  finished: boolean;

  @Column({ default: false })
  featured: boolean;

  @OneToMany(
    "ProjectTranslation",
    (translations: ProjectTranslation) => translations.base,
    { eager: true },
  )
  translations: TranslationEntity<ProjectTranslation>[];

  @ManyToMany(
    () => Skill,
    (skill) => skill.projects,
  )
  @JoinTable()
  skills: Skill[];

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
  career: Career | null;

  @ManyToOne(
    () => Education,
    (edu) => edu.projects,
    { nullable: true },
  )
  education: Education | null;

  @ManyToMany(
    () => Achievement,
    (achievement) => achievement.projects,
  )
  @JoinTable()
  achievements: Achievement[];
}
