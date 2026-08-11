import { Column, Entity, Index, ManyToOne, type Relation } from "typeorm";
import type { LanguageCode } from "@/lib/dto/language-code";
import type { DeepPartial } from "@/lib/types/shared-types";
import type { TranslationEntity } from "@/lib/types/translatable";
import { AppEntity } from "../app-entity";
import { Career } from "./career.entity";

@Entity("career_translation")
export class CareerTranslation
  extends AppEntity
  implements TranslationEntity<Career>
{
  constructor(input?: DeepPartial<CareerTranslation>) {
    super();
    this.initialize(input);
  }

  @Column("varchar")
  languageCode: LanguageCode;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true, type: "varchar" })
  location: string;

  @Column()
  organization: string;

  @Column({ type: "text" })
  responsibilities: string;

  @Column({ type: "text" })
  impact: string;

  @Column({ type: "text" })
  learned: string;

  @Index()
  @ManyToOne(
    () => Career,
    (base) => base.translations,
    { onDelete: "CASCADE" },
  )
  base: Relation<Career>;
}
