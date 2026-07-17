import { Column, Entity, OneToMany } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { AppEntity } from "../app-entity";
import type { ProfileAsset } from "./profile-asset.entity";

@Entity()
export class Profile extends AppEntity {
  constructor(input?: DeepPartial<Profile>) {
    super();
    this.initialize(input);
  }

  @Column({ type: "text" })
  summary: string;

  @Column()
  username: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  token?: string;

  @OneToMany(
    "ProfileAsset",
    (profileAsset: ProfileAsset) => profileAsset.profile,
  )
  assets: ProfileAsset[];
}
