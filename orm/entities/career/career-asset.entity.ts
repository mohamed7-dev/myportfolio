import { Column, Entity, Index, ManyToOne, type Relation } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { OrderableAsset } from "../asset/orderable-asset.entity";
import { Career } from "./career.entity";

@Entity("career_asset")
export class CareerAsset extends OrderableAsset {
  constructor(input?: DeepPartial<CareerAsset>) {
    super();
    this.initialize(input);
  }

  @Column({ type: "uuid", name: "careerId" })
  careerId: string;

  @Index()
  @ManyToOne(
    () => Career,
    (career) => career.assets,
    {
      onDelete: "CASCADE",
    },
  )
  career: Relation<Career>;
}
