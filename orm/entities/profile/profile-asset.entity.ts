import { Column, Entity, Index, ManyToOne, type Relation } from "typeorm";
import type { ProfileAssetType } from "@/lib/dto/profile";
import type { DeepPartial } from "@/lib/types/shared-types";
import { OrderableAsset } from "../asset/orderable-asset.entity";
import { Profile } from "./profile.entity";

@Entity("profile_asset")
export class ProfileAsset extends OrderableAsset {
  constructor(input?: DeepPartial<ProfileAsset>) {
    super();
    this.initialize(input);
  }

  @Column({ type: "varchar" })
  type: ProfileAssetType;

  @Column({ type: "uuid", name: "profileId" })
  profileId: string;

  @Index()
  @ManyToOne(
    () => Profile,
    (profile) => profile.assets,
    {
      onDelete: "CASCADE",
    },
  )
  profile: Relation<Profile>;
}
