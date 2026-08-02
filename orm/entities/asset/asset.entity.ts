import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import type { AssetType } from "@/lib/dto/asset";
import type { DeepPartial } from "@/lib/types/shared-types";
import type {
  LocaleString,
  Translatable,
  TranslationEntity,
} from "@/lib/types/translatable";
import type { Achievement } from "../achievement/achievement.entity";
import { AppEntity } from "../app-entity";
import type { Career } from "../career/career.entity";
import type { ContactMethod } from "../contact-method/contact-method.entity";
import type { Education } from "../education/education.entity";
import type { Profile } from "../profile/profile.entity";
import type { Project } from "../project/project.entity";
import type { Skill } from "../skill/skill.entity";
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

  @Column({ type: "varchar" })
  type: AssetType;

  @Column()
  sourceFileKey: string;

  @Column()
  previewFileKey: string;

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

  @Column()
  previewIdentifier: string;

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

  @OneToMany("Profile", (profile: Profile) => profile.featuredAsset)
  featuredInProfiles?: Profile[];

  @OneToMany("Skill", (skill: Skill) => skill.featuredAsset)
  featuredInSkills?: Skill[];

  @OneToMany("Career", (career: Career) => career.featuredAsset)
  featuredInCareers?: Career[];

  @OneToMany("Education", (education: Education) => education.featuredAsset)
  featuredInEducations?: Education[];

  @OneToMany("ContactMethod", (cm: ContactMethod) => cm.featuredAsset)
  featuredInContactMethods?: ContactMethod[];

  @OneToMany("Achievement", (cm: Achievement) => cm.featuredAsset)
  featuredInAchievements?: Achievement[];
}
