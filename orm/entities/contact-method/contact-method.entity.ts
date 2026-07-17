import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { AppEntity } from "../app-entity";
import { Asset } from "../asset/asset.entity";

@Entity()
export class ContactMethod extends AppEntity {
  constructor(input?: DeepPartial<ContactMethod>) {
    super();
    this.initialize(input);
  }

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  actionLabel: string;

  @Column()
  url: string;

  @Index()
  @OneToOne(() => Asset, { eager: true })
  @JoinColumn()
  logo: Asset;
}
