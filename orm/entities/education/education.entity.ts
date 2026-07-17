import { Column, Entity, OneToMany } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { AppEntity } from "../app-entity";
import { Project } from "../project/project.entity";
import type { EducationAsset } from "./education-asset.entity";

@Entity()
export class Education extends AppEntity {
  constructor(input?: DeepPartial<Education>) {
    super();
    this.initialize(input);
  }

  @Column()
  school: string;

  @Column()
  degree: string;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date" })
  endDate: Date;

  @Column()
  isPresent: boolean;

  @Column()
  location: string;

  @Column()
  gpa: string;

  @OneToMany(
    "EducationAsset",
    (educationAsset: EducationAsset) => educationAsset.education,
  )
  assets: EducationAsset[];

  @OneToMany(
    () => Project,
    (projects) => projects.education,
  )
  projects: Project[];
}
