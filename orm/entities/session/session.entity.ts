import { Column, Entity, Index, ManyToOne, type Relation } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { AppEntity } from "../app-entity";
import { Profile } from "../profile/profile.entity";

@Entity("session")
export class Session extends AppEntity {
  constructor(input: DeepPartial<Session>) {
    super();
    this.initialize(input);
  }

  /**
   * @description
   * Unique public facing identifier
   */
  @Index({
    unique: true,
  })
  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @Column()
  revoked: boolean;

  @Column({ type: "uuid", name: "profileId" })
  profileId: string;

  @Index()
  @ManyToOne(
    () => Profile,
    (profile) => profile.sessions,
    { onDelete: "CASCADE" },
  )
  profile: Relation<Profile>;
}
