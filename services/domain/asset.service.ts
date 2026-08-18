import { randomUUID } from "node:crypto";
import { In } from "typeorm";
import { camelCase } from "typeorm/util/StringUtils.js";
import type { RequestContext } from "@/api/request-context/request-context";
import { ObjectStorageResourceType } from "@/lib/config/object-storage-strategy.interface";
import { serverConfig } from "@/lib/config/server-config";
import { sharedConfig } from "@/lib/config/shared-config";
import type {
  AssetListInputSchema,
  CreateAssetInputSchema,
  DeleteAssetsInputSchema,
  UpdateAssetInputSchema,
} from "@/lib/dto/asset";
import {
  type AbortUploadSessionInputSchema,
  AssetUploadStatus,
  type CommitUploadSessionInputSchema,
  type CommitUploadSessionOutputSchema,
  type CreateAssetUploadInputSchema,
  type CreateAssetUploadOutputSchema,
} from "@/lib/dto/asset-upload";
import type { DeletionResponse, InputIdSchema } from "@/lib/dto/common";
import {
  ConflictError,
  EntityNotFoundError,
  InternalServerError,
  UserInputError,
} from "@/lib/errors/errors";
import { DefaultAssetNamingStrategy } from "@/lib/helpers/asset-naming";
import type { ClassType } from "@/lib/types/shared-types";
import { normalizeFileTypes } from "@/lib/utils/normalize-file-types";
import { notNullOrUndefined } from "@/lib/utils/not-null-or-undefined";
import { omit } from "@/lib/utils/omit";
import { validateMimeType } from "@/lib/utils/validate-mimetype";
import { AchievementAsset } from "@/orm/entities/achievement/achievement-asset.entity";
import type { AppEntity } from "@/orm/entities/app-entity";
import { Asset } from "@/orm/entities/asset/asset.entity";
import { AssetTranslation } from "@/orm/entities/asset/asset-translation.entity";
import type { OrderableAsset } from "@/orm/entities/asset/orderable-asset.entity";
import { AssetUpload } from "@/orm/entities/asset-upload/asset-upload.entity";
import { CareerAsset } from "@/orm/entities/career/career-asset.entity";
import { ContactMethodAsset } from "@/orm/entities/contact-method/contact-method-asset.entity";
import { EducationAsset } from "@/orm/entities/education/education-asset.entity";
import { ProfileAsset } from "@/orm/entities/profile/profile-asset.entity";
import { ProjectAsset } from "@/orm/entities/project/project-asset.entity";
import { SkillAsset } from "@/orm/entities/skill/skill-asset.entity";
import { ormService } from "@/orm/orm.service";
import { patchEntity } from "@/orm/utils/patch-entity";
import { listQueryBuilder } from "../helpers/list-query-builder.service";
import { translatableSaver } from "../helpers/translatable-saver/translatable-saver.service";
import { translator } from "../helpers/translator.service";
import { tagService } from "./tag.service";

export interface EntityWithAssets extends AppEntity {
  featuredAsset: Asset | null;
  assets: OrderableAsset[];
}

export interface EntityAssetInput {
  assetIds?: string[] | null;
  featuredAssetId?: string | null;
}

class AssetService {
  public async find(ctx: RequestContext, options: AssetListInputSchema) {
    const qb = await listQueryBuilder.build(Asset, options, {
      ctx,
      alias: "asset",
      relations: {
        translations: true,
      },
    });
    if (options?.filter?.type) {
      qb.andWhere("asset.type = :type", { type: options.filter.type.equals });
    }
    if (options?.filter?.name) {
      const name = options.filter.name.contains;
      if (name) {
        qb.andWhere("asset__translations.name LIKE :name", {
          name: `%${typeof name === "string" ? name.trim() : name}%`,
        });
      }
    }
    return await qb.getManyAndCount().then((result) => {
      return {
        items: result[0].flatMap((asset) =>
          translator.translate(ctx.languageCode, asset),
        ),
        itemsCount: result[1],
      };
    });
  }

  public async findOne(ctx: RequestContext, input: InputIdSchema) {
    const repo = await ormService.getRepository(ctx, Asset);
    return await repo
      .findOne({
        where: {
          id: input.id,
        },
      })
      .then((result) =>
        result ? translator.translate(ctx.languageCode, result) : undefined,
      );
  }

  public async create(
    ctx: RequestContext,
    input: CreateAssetInputSchema & { type?: ObjectStorageResourceType },
  ) {
    const repo = await ormService.getRepository(ctx, Asset);

    const newAsset = new Asset({
      sourceIdentifier: input.sourceIdentifier,
      previewIdentifier: input.previewIdentifier,
      width: input.width,
      height: input.height,
      mimetype: input.sourceFileMimetype,
      type: input.type,
      fileSize: input.sourceFileSize,
    });

    const asset = await repo.save(newAsset);
    const defaultName = await this.getSourceFileName(ctx, input.sourceFilename);
    let assetTranslations: AssetTranslation[];
    if (input.translations?.length) {
      assetTranslations = input.translations.map(
        (t) =>
          new AssetTranslation({
            languageCode: t.languageCode,
            name: t.name ?? defaultName,
            base: asset,
          }),
      );
    } else {
      // Create default translation using context language
      assetTranslations = [
        new AssetTranslation({
          languageCode: ctx.languageCode,
          name: defaultName,
          base: asset,
        }),
      ];
    }

    const translationRepo = await ormService.getRepository(
      ctx,
      AssetTranslation,
    );
    const savedTranslations = await translationRepo.save(assetTranslations);
    asset.translations = savedTranslations as any;
    await repo.save(asset);
    return translator.translate(ctx.languageCode, asset);
  }

  public async update(ctx: RequestContext, input: UpdateAssetInputSchema) {
    const repo = await ormService.getRepository(ctx, Asset);
    const asset = await repo.findOne({
      where: {
        id: input.id,
      },
    });

    if (!asset) {
      throw new EntityNotFoundError("Asset not found");
    }
    patchEntity(asset, omit(input, ["tags", "translations"]));
    if (input.tags) {
      asset.tags = await tagService.createTagsFromValues(ctx, input.tags);
    }
    const translationsInput = input.translations ?? [];
    const savedAsset = await repo.save(asset);
    if (translationsInput.length > 0) {
      await translatableSaver.update({
        ctx,
        input: { id: savedAsset.id, translations: translationsInput },
        entityType: Asset,
        translationEntityType: AssetTranslation,
      });
    }
    const translatedAsset = await this.findOne(ctx, { id: savedAsset.id });
    if (!translatedAsset) {
      throw new InternalServerError("Entity not found");
    }
    return translatedAsset;
  }

  public async delete(
    ctx: RequestContext,
    input: DeleteAssetsInputSchema,
  ): Promise<DeletionResponse[]> {
    const repo = await ormService.getRepository(ctx, Asset);
    const foundAssets = await Promise.all(
      input.ids.map(async (assetId) => {
        const asset = await repo.findOne({
          where: {
            id: assetId,
          },
        });

        if (!asset) {
          throw new EntityNotFoundError("Asset not found");
        }
        return asset;
      }),
    );

    return await Promise.all(
      foundAssets.map(async (asset) => {
        const assetUploadRepo = await ormService.getRepository(
          ctx,
          AssetUpload,
        );
        const assetUpload = await assetUploadRepo.findOne({
          where: {
            asset: {
              id: asset.id,
            },
          },
        });
        if (assetUpload && assetUpload.status === AssetUploadStatus.COMMITTED) {
          await Promise.all([
            serverConfig.asset.objectStorageStrategy.deleteObject(
              this.getObjectLocation(assetUpload.id, "source"),
              assetUpload.sourceResourceType,
            ),
            serverConfig.asset.objectStorageStrategy.deleteObject(
              this.getObjectLocation(assetUpload.id, "preview"),
              assetUpload.previewResourceType,
            ),
          ]).catch(() => {
            // Swallow Errors
          });
        }
        await repo.remove(asset);
        return {
          result: "DELETED",
          message: "",
        };
      }),
    );
  }

  public async updateEntityFeaturedAsset<Entity extends EntityWithAssets>(
    ctx: RequestContext,
    entity: Entity,
    input: EntityAssetInput,
  ): Promise<Entity> {
    const { assetIds, featuredAssetId } = input;
    if (
      featuredAssetId === null ||
      featuredAssetId === undefined ||
      (assetIds && assetIds.length === 0)
    ) {
      entity.featuredAsset = null;
      return entity;
    }

    const featuredAsset = await this.findOne(ctx, { id: featuredAssetId });
    if (featuredAsset) {
      entity.featuredAsset = featuredAsset;
    }
    return entity;
  }

  public async updateEntityAssets<Entity extends EntityWithAssets>(
    ctx: RequestContext,
    entity: Entity,
    input: EntityAssetInput,
  ) {
    if (!entity.id) {
      throw new InternalServerError("Entity must have an id");
    }
    const { assetIds } = input;
    const repo = await ormService.getRepository(ctx, Asset);
    if (assetIds?.length) {
      const assets = await repo.find({
        where: {
          id: In(assetIds),
        },
      });
      const sortedAssets = assetIds
        .map((id) => assets.find((a) => a.id === id))
        .filter(notNullOrUndefined);
      await this.removeExistingOrderableAssets(ctx, entity);
      if (sortedAssets.length > 0) {
        entity.assets = await this.createOrderableAssets(
          ctx,
          entity,
          sortedAssets,
        );
      } else {
        entity.assets = [];
      }
    } else if (assetIds?.length === 0) {
      await this.removeExistingOrderableAssets(ctx, entity);
    }

    return entity;
  }

  public async createUploadSession(
    ctx: RequestContext,
    input: CreateAssetUploadInputSchema,
  ): Promise<CreateAssetUploadOutputSchema> {
    const validationResult = this.validateUploadSessionInput(input);

    if (Array.isArray(validationResult) && validationResult.length) {
      throw new UserInputError(
        "Invalid upload session input",
        Object.fromEntries(
          validationResult.map((error) => [error.fileName, error.message]),
        ),
      );
    }

    const uploadId = randomUUID();

    const sourceFileKey = "source";

    const previewFileKey = "preview";

    const [sourceUploadUrl, previewUploadUrl] = await Promise.all([
      serverConfig.asset.objectStorageStrategy.createUploadRequest({
        location: this.getObjectLocation(uploadId, "source"),
        contentType: input.source.mimeType,
        contentLength: input.source.size,
        expiresInSeconds: 15 * 60,
        resourceType: this.getStorageResourceType(input.source.mimeType),
      }),

      serverConfig.asset.objectStorageStrategy.createUploadRequest({
        location: this.getObjectLocation(uploadId, "preview"),
        contentType: input.preview.mimeType,
        contentLength: input.preview.size,
        expiresInSeconds: 15 * 60,
        resourceType: this.getStorageResourceType(input.preview.mimeType),
      }),
    ]);

    const repo = await ormService.getRepository(ctx, AssetUpload);

    const upload = new AssetUpload({
      id: uploadId,
      sourceFileLocation: this.getObjectLocation(uploadId, "source"),
      previewFileLocation: this.getObjectLocation(uploadId, "preview"),
      sourceFileName: input.source.name,
      sourceMimeType: input.source.mimeType,
      sourceSize: input.source.size,
      sourceResourceType: this.getStorageResourceType(input.source.mimeType),
      previewMimeType: input.preview.mimeType,
      previewSize: input.preview.size,
      previewResourceType: this.getStorageResourceType(input.preview.mimeType),
      status: AssetUploadStatus.PENDING,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });

    await repo.save(upload);

    return {
      uploadId,
      source: {
        key: sourceFileKey,
        upload: sourceUploadUrl,
      },
      preview: {
        key: previewFileKey,
        upload: previewUploadUrl,
      },
    };
  }

  public async abortUpload(
    ctx: RequestContext,
    input: AbortUploadSessionInputSchema,
  ): Promise<void> {
    const repo = await ormService.getRepository(ctx, AssetUpload);

    const upload = await repo.findOne({
      where: {
        id: input.uploadSessionId,
      },
    });

    if (!upload) {
      return;
    }

    if (upload.status === AssetUploadStatus.ABORTED) {
      return;
    }

    if (upload.status === AssetUploadStatus.COMMITTED) {
      throw new ConflictError("This upload has already been completed.");
    }

    const [source, preview] = await Promise.allSettled([
      serverConfig.asset.objectStorageStrategy.headObject(
        this.getObjectLocation(upload.id, upload.sourceFileLocation.key),
        upload.sourceResourceType,
      ),
      serverConfig.asset.objectStorageStrategy.headObject(
        this.getObjectLocation(upload.id, upload.previewFileLocation.key),
        upload.previewResourceType,
      ),
    ]);

    const deletionPromises: Promise<void>[] = [];

    if (source.status === "fulfilled") {
      deletionPromises.push(
        serverConfig.asset.objectStorageStrategy.deleteObject(
          this.getObjectLocation(upload.id, upload.sourceFileLocation.key),
          upload.sourceResourceType,
        ),
      );
    }

    if (preview.status === "fulfilled") {
      deletionPromises.push(
        serverConfig.asset.objectStorageStrategy.deleteObject(
          this.getObjectLocation(upload.id, upload.previewFileLocation.key),
          upload.previewResourceType,
        ),
      );
    }

    await Promise.all(deletionPromises);

    // INFO: If deletion promises reject, we still get orphaned assets
    // this can be handled by a worker, so in that case we would need a logging mechanism

    await repo.update(upload.id, {
      status: AssetUploadStatus.ABORTED,
    });
  }

  public async completeAssetUpload(
    ctx: RequestContext,
    input: CommitUploadSessionInputSchema,
  ): Promise<CommitUploadSessionOutputSchema> {
    const uploadRepo = await ormService.getRepository(ctx, AssetUpload);

    const upload = await uploadRepo.findOne({
      where: {
        id: input.uploadSessionId,
      },
    });

    if (!upload) {
      throw new EntityNotFoundError("Upload session was not found.");
    }

    /*
     * Idempotency.
     */
    if (upload.status === AssetUploadStatus.COMMITTED) {
      if (!upload.asset.id) {
        throw new InternalServerError(
          "Completed upload has no associated asset.",
        );
      }

      return {
        assetId: upload.asset.id,
      };
    }

    if (upload.status === AssetUploadStatus.ABORTED) {
      throw new ConflictError("Upload session has already been aborted.");
    }

    if (upload.expiresAt.getTime() < Date.now()) {
      throw new ConflictError("Upload session has expired.");
    }

    /*
     * Verify the actual objects in storage.
     */
    const [sourceObject, previewObject] = await Promise.allSettled([
      serverConfig.asset.objectStorageStrategy.headObject(
        this.getObjectLocation(upload.id, upload.sourceFileLocation.key),
        upload.sourceResourceType,
      ),
      serverConfig.asset.objectStorageStrategy.headObject(
        this.getObjectLocation(upload.id, upload.previewFileLocation.key),
        upload.previewResourceType,
      ),
    ]);

    if (sourceObject.status !== "fulfilled") {
      throw new UserInputError("Source file was not uploaded.");
    }

    if (previewObject.status !== "fulfilled") {
      throw new UserInputError("Preview file was not uploaded.");
    }

    const sourceIdentifier = upload.sourceFileLocation.folder
      .concat(upload.sourceFileLocation.key)
      .join("/");
    const previewIdentifier = upload.previewFileLocation.folder
      .concat(upload.previewFileLocation.key)
      .join("/");

    const asset = await this.create(ctx, {
      sourceIdentifier,
      previewIdentifier,
      sourceFilename: upload.sourceFileName,
      sourceFileMimetype: upload.sourceMimeType,
      sourceFileSize: upload.sourceSize,
      type: upload.sourceResourceType,
      width: sourceObject.value?.metadata["width"] as number,
      height: sourceObject.value?.metadata["height"] as number,
    });

    upload.status = AssetUploadStatus.COMMITTED;

    upload.asset = asset;

    await uploadRepo.save(upload);

    return {
      assetId: asset.id,
    };
  }

  private getStorageResourceType(mimeType: string): ObjectStorageResourceType {
    if (mimeType.startsWith("image/")) {
      return ObjectStorageResourceType.image;
    }

    if (mimeType.startsWith("video/")) {
      return ObjectStorageResourceType.video;
    }

    return ObjectStorageResourceType.raw;
  }

  private validateUploadSessionInput(input: CreateAssetUploadInputSchema) {
    const errors: {
      message: string;
      code: "file-invalid-type" | "file-too-large";
      fileName: string;
    }[] = [];

    for (const [key, value] of Object.entries(input)) {
      type TypedKey = keyof typeof input;

      const assetConfig =
        (key as TypedKey) === "source"
          ? sharedConfig.asset.sourceFileTypes
          : sharedConfig.asset.previewFileTypes;

      const allowedExtensions = Object.values(assetConfig).flatMap(
        (item) => item.extensions,
      );

      const mimeTypes = normalizeFileTypes(allowedExtensions);

      if (!validateMimeType(value.mimeType, mimeTypes)) {
        errors.push({
          code: "file-invalid-type",
          message: `${key} file can end only by one of these extensions (${allowedExtensions.join(", ")}).`,
          fileName: value.name,
        });
      }

      const normalizedMimeType = mimeTypes.find(
        (m) => m.type === value.mimeType.split("/")[0],
      );

      const maxSizeForFileType = assetConfig[`${normalizedMimeType?.type}/*`]
        ? assetConfig[`${normalizedMimeType?.type}/*`].maxSizeInMb
        : undefined;

      if (
        !maxSizeForFileType ||
        value.size > maxSizeForFileType * 1024 * 1024
      ) {
        errors.push({
          code: "file-too-large",
          message: `${key} file size must be less than or equal to ${
            maxSizeForFileType ?? "the configured"
          } MB.`,
          fileName: value.name,
        });
      }
    }

    return errors.length > 0 ? errors : null;
  }

  private async getSourceFileName(
    ctx: RequestContext,
    filename: string,
  ): Promise<string> {
    let outputFileName: string | undefined;
    const assetNamingStrategy = new DefaultAssetNamingStrategy();

    const repo = await ormService.getRepository(ctx, AssetTranslation);

    const foundAssetWithName = await repo.findOne({
      where: {
        name: filename,
      },
    });

    if (foundAssetWithName) {
      outputFileName = assetNamingStrategy.createSourceName(
        filename,
        foundAssetWithName.name,
      );
    } else {
      outputFileName = assetNamingStrategy.createSourceName(
        filename,
        undefined,
      );
    }

    return outputFileName;
  }

  private async createOrderableAssets(
    ctx: RequestContext,
    entity: EntityWithAssets,
    assets: Asset[],
  ) {
    const orderableAssets = await Promise.all(
      assets.map((asset, i) => this.getOrderableAsset(ctx, entity, asset, i)),
    );
    const repo = await ormService.getRepository(
      ctx,
      orderableAssets[0].constructor,
    );

    return await repo.save(orderableAssets);
  }

  private async removeExistingOrderableAssets(
    ctx: RequestContext,
    entity: EntityWithAssets,
  ) {
    const relationProperty = this.getHostEntityRelationProperty(entity);
    const orderableAssetType = await this.getOrderableAssetType(ctx, entity);
    const repo = await ormService.getRepository(ctx, orderableAssetType);

    await repo.delete({
      [relationProperty]: {
        id: entity.id,
      },
    });
  }

  private async getOrderableAsset(
    ctx: RequestContext,
    entity: EntityWithAssets,
    asset: Asset,
    index: number,
  ): Promise<OrderableAsset> {
    const relationProperty = this.getHostEntityRelationProperty(entity);
    const orderableAssetType = await this.getOrderableAssetType(ctx, entity);
    return new orderableAssetType({
      asset: {
        id: asset.id,
      },
      position: index,
      [relationProperty]: {
        id: entity.id,
      },
    });
  }

  private getHostEntityRelationProperty(entity: EntityWithAssets): string {
    return camelCase(entity.constructor.name);
  }

  private async getOrderableAssetType(
    ctx: RequestContext,
    entity: EntityWithAssets,
  ): Promise<ClassType<OrderableAsset>> {
    const repo = await ormService.getRepository(ctx, entity.constructor);
    const assetRelation = repo.metadata.relations.find(
      (r) => r.propertyName === "assets",
    );
    if (!assetRelation) {
      throw new InternalServerError("Couldn't find matching orderable asset");
    }

    if (typeof assetRelation.type === "string") {
      switch (assetRelation.type) {
        case "ProjectAsset":
          return ProjectAsset;
        case "ProfileAsset":
          return ProfileAsset;
        case "SkillAsset":
          return SkillAsset;
        case "CareerAsset":
          return CareerAsset;
        case "EducationAsset":
          return EducationAsset;
        case "ContactMethodAsset":
          return ContactMethodAsset;
        case "AchievementAsset":
          return AchievementAsset;
        default:
          throw new InternalServerError(
            "Couldn't find matching orderable asset",
          );
      }
    }
    return assetRelation.type as ClassType<OrderableAsset>;
  }

  private getObjectLocation(uploadId: string, key: string) {
    return {
      key: key,
      folder: ["portfolio", uploadId],
    };
  }
}
export const assetService = new AssetService();
