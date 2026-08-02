import { Column, Entity, Index, ManyToOne } from "typeorm";
import type { LanguageCode } from "@/lib/dto/language-code";
import type { DeepPartial } from "@/lib/types/shared-types";
import type { TranslationEntity } from "@/lib/types/translatable";
import { AppEntity } from "../app-entity";
import { ContactMethod } from "./contact-method.entity";

@Entity()
export class ContactMethodTranslation
  extends AppEntity
  implements TranslationEntity<ContactMethod>
{
  constructor(input?: DeepPartial<ContactMethodTranslation>) {
    super();
    this.initialize(input);
  }

  @Column("varchar")
  languageCode: LanguageCode;

  @Column()
  name: string;

  @Index()
  @ManyToOne(
    () => ContactMethod,
    (base) => base.translations,
    { onDelete: "CASCADE" },
  )
  base: ContactMethod;
}
