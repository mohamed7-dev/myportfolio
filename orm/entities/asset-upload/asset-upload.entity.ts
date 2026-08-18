import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  type Relation,
} from "typeorm";
import type {
  ObjectLocation,
  ObjectStorageResourceType,
} from "@/lib/config/object-storage-strategy.interface";
import type { AssetUploadStatus } from "@/lib/dto/asset-upload";
import type { DeepPartial } from "@/lib/types/shared-types";
import { AppEntity } from "../app-entity";
import { Asset } from "../asset/asset.entity";

@Entity("asset_upload")
@Index(["status"])
@Index(["expiresAt"])
export class AssetUpload extends AppEntity {
  constructor(input?: DeepPartial<AssetUpload>) {
    super();
    this.initialize(input);
  }

  /**
   * Storage keys allocated by the server.
   *
   * The client receives the corresponding presigned
   * upload URLs, but never chooses these keys.
   */
  @Column({ type: "simple-json" })
  sourceFileLocation!: ObjectLocation;

  @Column({ type: "simple-json" })
  previewFileLocation: ObjectLocation;

  /**
   * Metadata expected from the client.
   *
   * These are used for validation when completing
   * the upload.
   */
  @Column({ type: "varchar", length: 255 })
  sourceFileName!: string;

  @Column({ type: "varchar", length: 255 })
  sourceMimeType!: string;

  @Column({ type: "bigint" })
  sourceSize!: number;

  @Column({ type: "varchar", length: 255 })
  previewMimeType!: string;

  @Column({ type: "bigint" })
  previewSize!: number;

  @Column({
    type: "varchar",
  })
  sourceResourceType: ObjectStorageResourceType;

  @Column({
    type: "varchar",
  })
  previewResourceType: ObjectStorageResourceType;

  @Column({
    type: "varchar",
  })
  status: AssetUploadStatus;

  /**
   * After this point the upload session is eligible
   * for cleanup if it wasn't committed.
   */
  @Column({ type: "timestamptz" })
  expiresAt!: Date;

  @OneToOne(() => Asset, { onDelete: "CASCADE", nullable: true, eager: true })
  @JoinColumn()
  asset: Relation<Asset>;
}
