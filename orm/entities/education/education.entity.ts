import { Column, Entity, Index, ManyToOne, OneToMany } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import type { LocaleString, TranslationEntity } from "@/lib/types/translatable";
import { AppEntity } from "../app-entity";
import { Asset } from "../asset/asset.entity";
import { Project } from "../project/project.entity";
import type { EducationAsset } from "./education-asset.entity";
import type { EducationTranslation } from "./education-translation.entity";

@Entity()
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
    "EducationAsset",
    (educationAsset: EducationAsset) => educationAsset.education,
  )
  assets: EducationAsset[];

  @Index()
  @ManyToOne(
    () => Asset,
    (asset) => asset.featuredInEducations,
    { onDelete: "SET NULL" },
  )
  featuredAsset: Asset;

  @OneToMany(
    "EducationTranslation",
    (translations: EducationTranslation) => translations.base,
    { eager: true },
  )
  translations: TranslationEntity<EducationTranslation>[];

  @OneToMany(
    () => Project,
    (projects) => projects.education,
  )
  projects: Project[];
}
