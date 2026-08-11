import { Column, Entity, Index, ManyToOne, type Relation } from "typeorm";
import type { LanguageCode } from "@/lib/dto/language-code";
import type { DeepPartial } from "@/lib/types/shared-types";
import type { TranslationEntity } from "@/lib/types/translatable";
import { AppEntity } from "../app-entity";
import { Skill } from "./skill.entity";

@Entity("skill_translation")
export class SkillTranslation
  extends AppEntity
  implements TranslationEntity<Skill>
{
  constructor(input?: DeepPartial<SkillTranslation>) {
    super();
    this.initialize(input);
  }

  @Column("varchar")
  languageCode: LanguageCode;

  @Column()
  name: string;

  @Index({ unique: false })
  @Column()
  slug: string;

  @Index()
  @ManyToOne(
    () => Skill,
    (base) => base.translations,
    { onDelete: "CASCADE" },
  )
  base: Relation<Skill>;
}
