import { Entity, Index, ManyToOne } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { OrderableAsset } from "../asset/orderable-asset.entity";
import { Achievement } from "./achievement.entity";

@Entity()
export class AchievementAsset extends OrderableAsset {
  constructor(input?: DeepPartial<AchievementAsset>) {
    super();
    this.initialize(input);
  }

  @Index()
  @ManyToOne(
    () => Achievement,
    (achievement) => achievement.assets,
    {
      onDelete: "CASCADE",
    },
  )
  achievement: Achievement;
}
