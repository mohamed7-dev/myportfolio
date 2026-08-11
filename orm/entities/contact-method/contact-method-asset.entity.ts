import { Column, Entity, Index, ManyToOne, type Relation } from "typeorm";
import type { DeepPartial } from "@/lib/types/shared-types";
import { OrderableAsset } from "../asset/orderable-asset.entity";
import { ContactMethod } from "./contact-method.entity";

@Entity("contact_method_asset")
export class ContactMethodAsset extends OrderableAsset {
  constructor(input?: DeepPartial<ContactMethodAsset>) {
    super();
    this.initialize(input);
  }

  @Column({ type: "uuid", name: "contactMethodId" })
  contactMethodId: string;

  @Index()
  @ManyToOne(
    () => ContactMethod,
    (cm) => cm.assets,
    {
      onDelete: "CASCADE",
    },
  )
  contactMethod: Relation<ContactMethod>;
}
