import { Column, Entity, OneToMany } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { Achievement } from "../achievement/achievement.entity";
import { AppEntity } from "../app-entity";
import { Project } from "../project/project.entity";
import type { CareerAsset } from "./career-asset.entity";

export enum CareerType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  FREELANCE = "FREELANCE",
  INTERNSHIP = "INTERNSHIP",
  TRAINING = "TRAINING",
  CONTRACT = "CONTRACT",
}

export enum CareerMode {
  ON_SITE = "ON_SITE",
  REMOTE = "REMOTE",
}

@Entity()
export class Career extends AppEntity {
  constructor(input?: DeepPartial<Career>) {
    super();
    this.initialize(input);
  }

  @Column()
  title: string;

  @Column()
  organization: string;

  @Column({ type: "date" })
  startDate: Date;

  @Column({ type: "date" })
  endDate: Date;

  @Column()
  isPresent: boolean;

  @Column()
  mode: CareerMode;

  @Column()
  type: CareerType;

  @Column({ type: "text" })
  responsibilities: string;

  @Column({ type: "text" })
  impact: string;

  @Column({ type: "text" })
  learned: string;

  @OneToMany("CareerAsset", (careerAsset: CareerAsset) => careerAsset.career)
  assets: CareerAsset[];

  @OneToMany(
    () => Project,
    (projects) => projects.career,
  )
  projects: Project[];

  @OneToMany(
    () => Achievement,
    (achievement) => achievement.career,
  )
  achievements: Achievement[];
}
