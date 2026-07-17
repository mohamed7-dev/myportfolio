import { Column, Index, ManyToOne } from "typeorm";
import type { DeepPartial, Orderable } from "@/lib/types/shared-types";
import { AppEntity } from "../app-entity";
import type { Asset } from "./asset.entity";

export abstract class OrderableAsset extends AppEntity implements Orderable {
  protected constructor(input?: DeepPartial<OrderableAsset>) {
    super();
    this.initialize(input);
  }

  @Index()
  @ManyToOne("Asset", { eager: true, onDelete: "CASCADE" })
  asset: Asset;

  @Column()
  position: number;
}
