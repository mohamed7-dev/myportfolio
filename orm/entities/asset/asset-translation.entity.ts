import { Column, Entity, Index, ManyToOne, type Relation } from "typeorm";
import type { LanguageCode } from "@/lib/dto/language-code";
import type { DeepPartial } from "@/lib/types/shared-types";
import type { TranslationEntity } from "@/lib/types/translatable";
import { AppEntity } from "../app-entity";
import { Asset } from "./asset.entity";

@Entity("asset_translation")
export class AssetTranslation
  extends AppEntity
  implements TranslationEntity<Asset>
{
  constructor(input?: DeepPartial<AssetTranslation>) {
    super();
    this.initialize(input);
  }

  @Column("varchar")
  languageCode: LanguageCode;

  @Column()
  name: string;

  @Index()
  @ManyToOne(
    () => Asset,
    (base: Asset) => base.translations,
    {
      onDelete: "CASCADE",
    },
  )
  base: Relation<Asset>;
}
