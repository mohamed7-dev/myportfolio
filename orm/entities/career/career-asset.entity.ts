import { Entity, Index, ManyToOne } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { OrderableAsset } from "../asset/orderable-asset.entity";
import { Career } from "./career.entity";

@Entity()
export class CareerAsset extends OrderableAsset {
  constructor(input?: DeepPartial<CareerAsset>) {
    super();
    this.initialize(input);
  }

  @Index()
  @ManyToOne(
    () => Career,
    (career) => career.assets,
    {
      onDelete: "CASCADE",
    },
  )
  career: Career;
}
