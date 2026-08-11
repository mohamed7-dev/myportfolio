import { Column, Entity, Index, ManyToOne, type Relation } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { OrderableAsset } from "../asset/orderable-asset.entity";
import { Skill } from "./skill.entity";

@Entity("skill_asset")
export class SkillAsset extends OrderableAsset {
  constructor(input?: DeepPartial<SkillAsset>) {
    super();
    this.initialize(input);
  }

  @Column({ type: "uuid", name: "skillId" })
  skillId: string;

  @Index()
  @ManyToOne(
    () => Skill,
    (skill) => skill.assets,
    {
      onDelete: "CASCADE",
    },
  )
  skill: Relation<Skill>;
}
