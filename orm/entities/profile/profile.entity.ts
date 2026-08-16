import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  type Relation,
} from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import type {
  LocaleString,
  Translatable,
  TranslationEntity,
} from "@/lib/types/translatable";
import { AppEntity } from "../app-entity";
import { Asset } from "../asset/asset.entity";
import { ProfileAsset } from "./profile-asset.entity";
import { ProfileTranslation } from "./profile-translation.entity";

@Entity("profile")
export class Profile extends AppEntity implements Translatable {
  constructor(input?: DeepPartial<Profile>) {
    super();
    this.initialize(input);
  }

  summary: LocaleString;

  displayName: LocaleString;

  intro: LocaleString;

  subHeading: LocaleString;

  subtitle: LocaleString;

  jobTitle: LocaleString;

  location: LocaleString;

  currentFocus: LocaleString;

  @Column({ type: "int", default: 0 })
  projectsShipped: number;

  @Column({ type: "int", default: 0 })
  openSourceContributions: number;

  @Column({ type: "int", default: 0 })
  yearsOfExperience: number;

  @Column()
  handle: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  token?: string;

  @OneToMany(
    () => ProfileAsset,
    (profileAsset: ProfileAsset) => profileAsset.profile,
  )
  assets: Relation<ProfileAsset[]>;

  @Index()
  @ManyToOne(
    () => Asset,
    (asset) => asset.featuredInProfiles,
    { onDelete: "RESTRICT" },
  )
  featuredAsset: Relation<Asset>;

  @OneToMany(
    () => ProfileTranslation,
    (translations: TranslationEntity<ProfileTranslation>) => translations.base,
    { eager: true },
  )
  translations: Relation<TranslationEntity<ProfileTranslation>[]>;
}
