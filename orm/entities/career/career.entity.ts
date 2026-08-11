import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  type Relation,
} from "typeorm";
import type { CareerMode, CareerType } from "@/lib/dto/career";
import type { DeepPartial } from "@/lib/types/shared-types";
import type { LocaleString, TranslationEntity } from "@/lib/types/translatable";
import { Achievement } from "../achievement/achievement.entity";
import { AppEntity } from "../app-entity";
import { Asset } from "../asset/asset.entity";
import { Project } from "../project/project.entity";
import { CareerTranslation } from "./career.translation";
import { CareerAsset } from "./career-asset.entity";

@Entity("career")
export class Career extends AppEntity {
  constructor(input?: DeepPartial<Career>) {
    super();
    this.initialize(input);
  }

  name: LocaleString;

  slug: LocaleString;

  location: LocaleString;

  organization: LocaleString;

  responsibilities: LocaleString;

  impact: LocaleString;

  learned: LocaleString;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date", nullable: true })
  endDate: Date | null;

  @Column()
  isPresent: boolean;

  @Column({ type: "varchar" })
  mode: CareerMode;

  @Column({ type: "varchar" })
  type: CareerType;

  @OneToMany(
    () => CareerAsset,
    (careerAsset: CareerAsset) => careerAsset.career,
  )
  assets: Relation<CareerAsset[]>;

  @Index()
  @ManyToOne(
    () => Asset,
    (asset) => asset.featuredInCareers,
    { onDelete: "SET NULL" },
  )
  featuredAsset: Relation<Asset>;

  @OneToMany(
    () => Project,
    (projects) => projects.career,
  )
  projects: Project[];

  @OneToMany(
    () => Achievement,
    (achievement) => achievement.career,
  )
  achievements: Achievement[];

  @OneToMany(
    () => CareerTranslation,
    (translations: CareerTranslation) => translations.base,
    { eager: true },
  )
  translations: Relation<TranslationEntity<CareerTranslation>[]>;
}
