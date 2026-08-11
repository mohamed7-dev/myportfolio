import { Column, Entity, Index, ManyToOne, type Relation } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { OrderableAsset } from "../asset/orderable-asset.entity";
import { Achievement } from "./achievement.entity";

@Entity("achievement_asset")
export class AchievementAsset extends OrderableAsset {
  constructor(input?: DeepPartial<AchievementAsset>) {
    super();
    this.initialize(input);
  }

  @Column({ type: "uuid", name: "achievementId" })
  achievementId: string;

  @Index()
  @ManyToOne(
    () => Achievement,
    (achievement) => achievement.assets,
    {
      onDelete: "CASCADE",
    },
  )
  achievement: Relation<Achievement>;
}
