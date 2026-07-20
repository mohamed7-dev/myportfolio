import { Column, Entity, OneToMany } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import type {
  LocaleString,
  Translatable,
  TranslationEntity,
} from "@/lib/types/translatable";
import { AppEntity } from "../app-entity";
import type { ProfileAsset } from "./profile-asset.entity";
import type { ProfileTranslation } from "./profile-translation.entity";

@Entity()
export class Profile extends AppEntity implements Translatable {
  constructor(input?: DeepPartial<Profile>) {
    super();
    this.initialize(input);
  }

  summary: LocaleString;

  displayName: LocaleString;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  token?: string;

  @OneToMany(
    "ProfileAsset",
    (profileAsset: ProfileAsset) => profileAsset.profile,
  )
  assets: ProfileAsset[];

  @OneToMany(
    "ProfileTranslation",
    (translations: TranslationEntity<ProfileTranslation>) => translations.base,
    { eager: true },
  )
  translations: TranslationEntity<ProfileTranslation>[];
}
