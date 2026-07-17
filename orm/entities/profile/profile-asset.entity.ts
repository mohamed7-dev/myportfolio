import { Entity, Index, ManyToOne } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { OrderableAsset } from "../asset/orderable-asset.entity";
import { Profile } from "./profile.entity";

@Entity()
export class ProfileAsset extends OrderableAsset {
  constructor(input?: DeepPartial<ProfileAsset>) {
    super();
    this.initialize(input);
  }

  @Index()
  @ManyToOne(
    () => Profile,
    (profile) => profile.assets,
    {
      onDelete: "CASCADE",
    },
  )
  profile: Profile;
}
