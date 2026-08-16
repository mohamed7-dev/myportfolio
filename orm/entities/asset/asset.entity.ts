import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  type Relation,
} from "typeorm";
import type { ObjectStorageResourceType } from "@/lib/config/object-storage-strategy.interface";
import type { DeepPartial } from "@/lib/types/shared-types";
import type {
  LocaleString,
  Translatable,
  TranslationEntity,
} from "@/lib/types/translatable";
import { Achievement } from "../achievement/achievement.entity";
import { AppEntity } from "../app-entity";
import { Career } from "../career/career.entity";
import { ContactMethod } from "../contact-method/contact-method.entity";
import { Education } from "../education/education.entity";
import { Profile } from "../profile/profile.entity";
import { Project } from "../project/project.entity";
import { Skill } from "../skill/skill.entity";
import { Tag } from "../tag/tag.entity";
import { AssetTranslation } from "./asset-translation.entity";

@Entity("asset")
export class Asset extends AppEntity implements Translatable {
  constructor(input?: DeepPartial<Asset>) {
    super();
    this.initialize(input);
  }

  name: LocaleString;

  @Column()
  mimetype: string;

  @Column({ type: "varchar" })
  type: ObjectStorageResourceType;

  @Column({
    default: 0,
  })
  width: number;

  @Column({
    default: 0,
  })
  height: number;

  @Column()
  fileSize: number;

  @Column()
  sourceIdentifier: string;

  @Column()
  previewIdentifier: string;

  @OneToMany(
    () => AssetTranslation,
    (translations: TranslationEntity<AssetTranslation>) => translations.base,
    { eager: true },
  )
  translations: Relation<TranslationEntity<AssetTranslation>[]>;

  @ManyToMany(() => Tag)
  @JoinTable({ name: "asset_tags_tag" })
  tags: Tag[];

  @OneToMany(
    () => Project,
    (project: Project) => project.featuredAsset,
  )
  featuredInProjects?: Relation<Project[]>;

  @OneToMany(
    () => Profile,
    (profile: Profile) => profile.featuredAsset,
  )
  featuredInProfiles?: Relation<Profile[]>;

  @OneToMany(
    () => Skill,
    (skill: Skill) => skill.featuredAsset,
  )
  featuredInSkills?: Relation<Skill[]>;

  @OneToMany(
    () => Career,
    (career: Career) => career.featuredAsset,
  )
  featuredInCareers?: Relation<Career[]>;

  @OneToMany(
    () => Education,
    (education: Education) => education.featuredAsset,
  )
  featuredInEducations?: Relation<Education[]>;

  @OneToMany(
    () => ContactMethod,
    (cm: ContactMethod) => cm.featuredAsset,
  )
  featuredInContactMethods?: Relation<ContactMethod[]>;

  @OneToMany(
    () => Achievement,
    (cm: Achievement) => cm.featuredAsset,
  )
  featuredInAchievements?: Relation<Achievement[]>;
}
