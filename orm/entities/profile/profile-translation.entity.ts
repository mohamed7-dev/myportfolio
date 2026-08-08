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

  @Column({ type: "text" })
  summary: string;

  @Column()
  intro: string;

  @Column()
  jobTitle: string;

  @Column()
  location: string;

  @Column()
  subHeading: string;

  @Column()
  subtitle: string;

  @Column({ type: "text" })
  currentFocus: string;

  @Column()
  displayName: string;

  @Index()
  @ManyToOne("Profile", (base: Profile) => base.translations, {
    onDelete: "CASCADE",
  })
  base: Profile;
}
