import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  type Relation,
} from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { OrderableAsset } from "../asset/orderable-asset.entity";
import { Project } from "./project.entity";

@Entity("project_asset")
export class ProjectAsset extends OrderableAsset {
  constructor(input?: DeepPartial<ProjectAsset>) {
    super();
    this.initialize(input);
  }

  @Column({ type: "uuid", name: "projectId" })
  projectId: string;

  @Index()
  @ManyToOne(
    () => Project,
    (project) => project.assets,
    {
      onDelete: "CASCADE",
    },
  )
  @JoinColumn({ name: "projectId" })
  project: Relation<Project>;
}
