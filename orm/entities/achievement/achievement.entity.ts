import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { AppEntity } from "../app-entity";
import { Career } from "../career/career.entity";
import { Project } from "../project/project.entity";
import type { AchievementAsset } from "./achievement-asset.entity";

export enum AchievementType {
  CERTIFICATE = "CERTIFICATE",
  COURSE = "COURSE",
  INTERNSHIP = "INTERNSHIP",
}

@Entity()
export class Achievement extends AppEntity {
  constructor(input?: DeepPartial<Achievement>) {
    super();
    this.initialize(input);
  }

  @Column()
  title: string;

  @Column()
  organization: string;

  @Column()
  type: AchievementType;

  @Column({ type: "date" })
  issueDate: Date;

  @Column()
  credentialUrl: string;

  @OneToMany(
    "AchievementAsset",
    (achievementAsset: AchievementAsset) => achievementAsset.achievement,
  )
  assets: AchievementAsset[];

  @ManyToOne(
    () => Career,
    (career) => career.achievements,
    { nullable: true },
  )
  career?: Career | null;

  @ManyToMany(
    () => Project,
    (project) => project.achievements,
  )
  @JoinTable()
  projects?: Project[];
}
