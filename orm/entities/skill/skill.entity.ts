import { Column, Entity, OneToMany } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { AppEntity } from "../app-entity";
import type { SkillAsset } from "./skill-asset.entity";

export enum SkillCategory {
  FRONTEND = "FRONTEND",
  BACKEND = "BACKEND",
  TOOLS = "TOOLS",
  PROGRAMMING_LANGUAGES = " PROGRAMMING_LANGUAGES",
}

@Entity()
export class Skill extends AppEntity {
  constructor(input?: DeepPartial<Skill>) {
    super();
    this.initialize(input);
  }

  @Column()
  value: string;

  @Column()
  category: SkillCategory;

  @OneToMany("SkillAsset", (skillAsset: SkillAsset) => skillAsset.skill)
  assets: SkillAsset[];
}
