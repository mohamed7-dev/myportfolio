import { Column, Entity, Index, ManyToOne, OneToMany } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import type { LocaleString, TranslationEntity } from "@/lib/types/translatable";
import { AppEntity } from "../app-entity";
import { Asset } from "../asset/asset.entity";
import type { ContactMethodAsset } from "./contact-method-asset.entity";
import type { ContactMethodTranslation } from "./contact-method-translation.entity";

@Entity()
export class ContactMethod extends AppEntity {
  constructor(input?: DeepPartial<ContactMethod>) {
    super();
    this.initialize(input);
  }

  name: LocaleString;

  @Column()
  url: string;

  @Column({ nullable: true, type: "text" })
  copyableText: string;

  @OneToMany(
    "ContactMethodAsset",
    (cmAsset: ContactMethodAsset) => cmAsset.contactMethod,
  )
  assets: ContactMethodAsset[];

  @Index()
  @ManyToOne(
    () => Asset,
    (asset) => asset.featuredInContactMethods,
    { onDelete: "SET NULL" },
  )
  featuredAsset: Asset;

  @OneToMany(
    "ContactMethodTranslation",
    (translations: ContactMethodTranslation) => translations.base,
    { eager: true },
  )
  translations: TranslationEntity<ContactMethodTranslation>[];
}
