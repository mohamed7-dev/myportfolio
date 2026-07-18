import { Column, Entity, Index, ManyToOne } from "typeorm";
import type { LanguageCode } from "@/lib/dto/language-code";
import type { DeepPartial } from "@/lib/types/shared-types";
import type { TranslationEntity } from "@/lib/types/translatable";
import { AppEntity } from "../app-entity";
import { Project } from "./project.entity";

@Entity()
export class ProjectTranslation
  extends AppEntity
  implements TranslationEntity<Project>
{
  constructor(input?: DeepPartial<ProjectTranslation>) {
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

  @Column({ type: "text" })
  description: string;

  @Column({ type: "text" })
  overview: string;

  @Column({ type: "text" })
  features: string;

  @Column({ type: "text" })
  technicalHighlights: string;

  @Column({ type: "text" })
  contributions: string;

  @Column({ type: "text" })
  challengesAndSolutions: string;

  @Column({ type: "text" })
  techStack: string;

  @Index()
  @ManyToOne(
    () => Project,
    (base) => base.translations,
    { onDelete: "CASCADE" },
  )
  base: Project;
}
