import { Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { OrderableAsset } from "../asset/orderable-asset.entity";
import { Project } from "./project.entity";

@Entity()
export class ProjectAsset extends OrderableAsset {
  constructor(input?: DeepPartial<ProjectAsset>) {
    super();
    this.initialize(input);
  }

  @Index()
  @ManyToOne(
    () => Project,
    (project) => project.assets,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({ name: "projectId" })
  project: Project;
}
