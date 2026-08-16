import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  type Relation,
} from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import type { LocaleString, TranslationEntity } from "@/lib/types/translatable";
import { AppEntity } from "../app-entity";
import { Asset } from "../asset/asset.entity";
import { Project } from "../project/project.entity";
import { EducationAsset } from "./education-asset.entity";
import { EducationTranslation } from "./education-translation.entity";

@Entity("education")
export class Education extends AppEntity {
  constructor(input?: DeepPartial<Education>) {
    super();
    this.initialize(input);
  }

  school: LocaleString;

  slug: LocaleString;

  degree: LocaleString;

  location: LocaleString;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date", nullable: true })
  endDate: Date | null;

  @Column()
  isPresent: boolean;

  @Column({ nullable: true, type: "real" })
  gpa: number;

  @OneToMany(
    () => EducationAsset,
    (educationAsset: EducationAsset) => educationAsset.education,
  )
  assets: Relation<EducationAsset[]>;

  @Index()
  @ManyToOne(
    () => Asset,
    (asset) => asset.featuredInEducations,
    { onDelete: "RESTRICT" },
  )
  featuredAsset: Relation<Asset>;

  @OneToMany(
    () => EducationTranslation,
    (translations: EducationTranslation) => translations.base,
    { eager: true },
  )
  translations: Relation<TranslationEntity<EducationTranslation>[]>;

  @OneToMany(
    () => Project,
    (projects) => projects.education,
  )
  projects: Project[];
}
