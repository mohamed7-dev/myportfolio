import { Entity, Index, ManyToOne } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { OrderableAsset } from "../asset/orderable-asset.entity";
import { Education } from "./education.entity";

@Entity()
export class EducationAsset extends OrderableAsset {
  constructor(input?: DeepPartial<EducationAsset>) {
    super();
    this.initialize(input);
  }

  @Index()
  @ManyToOne(
    () => Education,
    (education) => education.assets,
    {
      onDelete: "CASCADE",
    },
  )
  education: Education;
}
