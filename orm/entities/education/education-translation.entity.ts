import { Column, Entity, Index, ManyToOne, type Relation } from "typeorm";
import type { LanguageCode } from "@/lib/dto/language-code";
import type { DeepPartial } from "@/lib/types/shared-types";
import type { TranslationEntity } from "@/lib/types/translatable";
import { AppEntity } from "../app-entity";
import { Education } from "./education.entity";

@Entity("education_translation")
export class EducationTranslation
  extends AppEntity
  implements TranslationEntity<Education>
{
  constructor(input?: DeepPartial<EducationTranslation>) {
    super();
    this.initialize(input);
  }

  @Column("varchar")
  languageCode: LanguageCode;

  @Column()
  school: string;

  @Index({ unique: true })
  @Column()
  slug: string;

  @Column({ nullable: true, type: "varchar" })
  degree: string;

  @Column({ nullable: true, type: "varchar" })
  location: string;

  @Index()
  @ManyToOne(
    () => Education,
    (base) => base.translations,
    { onDelete: "CASCADE" },
  )
  base: Relation<Education>;
}
