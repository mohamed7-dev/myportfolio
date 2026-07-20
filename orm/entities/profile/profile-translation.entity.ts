import { Column, Entity, Index, ManyToOne } from "typeorm";
import type { LanguageCode } from "@/lib/dto/language-code";
import type { DeepPartial } from "@/lib/types/shared-types";
import type { TranslationEntity } from "@/lib/types/translatable";
import { AppEntity } from "../app-entity";
import type { Profile } from "./profile.entity";

@Entity()
export class ProfileTranslation
  extends AppEntity
  implements TranslationEntity<Profile>
{
  constructor(input?: DeepPartial<ProfileTranslation>) {
    super();
    this.initialize(input);
  }

  @Column("varchar")
  languageCode: LanguageCode;

  @Column()
  summary: string;

  @Column()
  displayName: string;

  @Index()
  @ManyToOne("Profile", (base: Profile) => base.translations, {
    onDelete: "CASCADE",
  })
  base: Profile;
}
