import { Column, Entity, Index, ManyToOne, type Relation } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { OrderableAsset } from "../asset/orderable-asset.entity";
import { Education } from "./education.entity";

@Entity("education_asset")
export class EducationAsset extends OrderableAsset {
  constructor(input?: DeepPartial<EducationAsset>) {
    super();
    this.initialize(input);
  }

  @Column({ type: "uuid", name: "educationId" })
  educationId: string;

  @Index()
  @ManyToOne(
    () => Education,
    (education) => education.assets,
    {
      onDelete: "CASCADE",
    },
  )
  education: Relation<Education>;
}
