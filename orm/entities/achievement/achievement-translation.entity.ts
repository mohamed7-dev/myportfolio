import { Column, Entity, Index, ManyToOne } from "typeorm";
import type { LanguageCode } from "@/lib/dto/language-code";
import type { DeepPartial } from "@/lib/types/shared-types";
import type { TranslationEntity } from "@/lib/types/translatable";
import { AppEntity } from "../app-entity";
import { Achievement } from "./achievement.entity";

@Entity()
export class AchievementTranslation
  extends AppEntity
  implements TranslationEntity<Achievement>
{
  constructor(input?: DeepPartial<AchievementTranslation>) {
    super();
    this.initialize(input);
  }

  @Column("varchar")
  languageCode: LanguageCode;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  slug: string;

  @Column()
  organization: string;

  @Index()
  @ManyToOne(
    () => Achievement,
    (base) => base.translations,
    { onDelete: "CASCADE" },
  )
  base: Achievement;
}
