import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import type {
  LocaleString,
  Translatable,
  TranslationEntity,
} from "@/lib/types/translatable";
import { AppEntity } from "../app-entity";
import type { Project } from "../project/project.entity";
import { Tag } from "../tag/tag.entity";
import type { AssetTranslation } from "./asset-translation.entity";

@Entity()
export class Asset extends AppEntity implements Translatable {
  constructor(input?: DeepPartial<Asset>) {
    super();
    this.initialize(input);
  }

  name: LocaleString;

  @Column()
  mimetype: string;

  @Column()
  fileKey: string;

  @Column({
    default: 0,
  })
  width: number;

  @Column({
    default: 0,
  })
  height: number;

  @Column()
  fileSize: number;

  @Column()
  sourceIdentifier: string;

  @OneToMany(
    "AssetTranslation",
    (translations: TranslationEntity<AssetTranslation>) => translations.base,
    { eager: true },
  )
  translations: TranslationEntity<AssetTranslation>[];

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];

  @OneToMany("Project", (project: Project) => project.featuredAsset)
  featuredInProjects?: Project[];
}
