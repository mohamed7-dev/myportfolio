import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  type Relation,
} from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import type { LocaleString, TranslationEntity } from "@/lib/types/translatable";
import { AppEntity } from "../app-entity";
import { Asset } from "../asset/asset.entity";
import { ContactMethodAsset } from "./contact-method-asset.entity";
import { ContactMethodTranslation } from "./contact-method-translation.entity";

@Entity("contact_method")
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

  @Column({ default: true })
  enabled: boolean;

  @Column({ default: false })
  primary: boolean;

  @OneToMany(
    () => ContactMethodAsset,
    (cmAsset: ContactMethodAsset) => cmAsset.contactMethod,
  )
  assets: Relation<ContactMethodAsset[]>;

  @Index()
  @ManyToOne(
    () => Asset,
    (asset) => asset.featuredInContactMethods,
    { onDelete: "RESTRICT" },
  )
  featuredAsset: Relation<Asset>;

  @OneToMany(
    () => ContactMethodTranslation,
    (translations: ContactMethodTranslation) => translations.base,
    { eager: true },
  )
  translations: Relation<TranslationEntity<ContactMethodTranslation>[]>;
}
