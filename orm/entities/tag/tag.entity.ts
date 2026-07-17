import { Column, Entity } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { AppEntity } from "../app-entity";

@Entity()
export class Tag extends AppEntity {
  constructor(input?: DeepPartial<Tag>) {
    super();
    this.initialize(input);
  }

  @Column()
  value: string;
}
