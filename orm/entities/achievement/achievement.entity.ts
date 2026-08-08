import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import type { AchievementType } from "@/lib/dto/achievement";
import type { DeepPartial } from "@/lib/types/shared-types";
import type { LocaleString, TranslationEntity } from "@/lib/types/translatable";
import { AppEntity } from "../app-entity";
import { Asset } from "../asset/asset.entity";
import { Career } from "../career/career.entity";
import { Project } from "../project/project.entity";
import type { AchievementAsset } from "./achievement-asset.entity";
import type { AchievementTranslation } from "./achievement-translation.entity";

@Entity()
export class Achievement extends AppEntity {
  constructor(input?: DeepPartial<Achievement>) {
    super();
    this.initialize(input);
  }

  name: LocaleString;

  slug: LocaleString;

  organization: LocaleString;

  @Column({ type: "varchar" })
  type: AchievementType;

  @Column({ type: "date" })
  issueDate: Date;

  @Column()
  credentialUrl: string;

  @OneToMany(
    "AchievementTranslation",
    (translations: AchievementTranslation) => translations.base,
    { eager: true },
  )
  translations: TranslationEntity<AchievementTranslation>[];

  @OneToMany(
    "AchievementAsset",
    (achievementAsset: AchievementAsset) => achievementAsset.achievement,
  )
  assets: AchievementAsset[];

  @Index()
  @ManyToOne(
    () => Asset,
    (asset) => asset.featuredInAchievements,
    { onDelete: "SET NULL" },
  )
  featuredAsset: Asset;

  @ManyToOne(
    () => Career,
    (career) => career.achievements,
    { nullable: true },
  )
  career?: Career | null;

  @ManyToMany(
    () => Project,
    (project) => project.achievements,
  )
  projects?: Project[];
}
