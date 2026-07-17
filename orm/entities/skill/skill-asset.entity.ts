import { Entity, Index, ManyToOne } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { OrderableAsset } from "../asset/orderable-asset.entity";
import { Skill } from "./skill.entity";

@Entity()
export class SkillAsset extends OrderableAsset {
  constructor(input?: DeepPartial<SkillAsset>) {
    super();
    this.initialize(input);
  }

  @Index()
  @ManyToOne(
    () => Skill,
    (skill) => skill.assets,
    {
      onDelete: "CASCADE",
    },
  )
  skill: Skill;
}
