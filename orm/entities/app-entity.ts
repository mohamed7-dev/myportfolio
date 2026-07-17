import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";

export abstract class AppEntity {
  protected initialize<T>(input?: DeepPartial<T>) {
    if (input) {
      Object.assign(this, input);
    }
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
