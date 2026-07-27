import { Asset } from "@/orm/entities/asset/asset.entity";
import "server-only";
import { imageSize } from "image-size";
import mime from "mime-types";
import { In } from "typeorm";
import { camelCase } from "typeorm/util/StringUtils.js";
import type { RequestContext } from "@/api/request-context/request-context";
import { getCurrentLocale } from "@/i18n/server";
import {
  type AssetListInputSchema,
  AssetType,
  type CreateAssetInputSchema,
  type DeleteAssetsInputSchema,
  type UpdateAssetInputSchema,
} from "@/lib/dto/asset";
import type { DeletionResponse, InputIdSchema } from "@/lib/dto/common";
import type { LanguageCode } from "@/lib/dto/language-code";
import {
  EntityNotFoundError,
  InternalServerError,
  UserInputError,
} from "@/lib/errors/errors";
import { DefaultAssetNamingStrategy } from "@/lib/helpers/asset-naming";
import { utApi } from "@/lib/helpers/utapi";
import type { ClassType } from "@/lib/types/shared-types";
import { notNullOrUndefined } from "@/lib/utils/not-null-or-undefined";
import { omit } from "@/lib/utils/omit";
import type { AppEntity } from "@/orm/entities/app-entity";
import { AssetTranslation } from "@/orm/entities/asset/asset-translation.entity";
import type { OrderableAsset } from "@/orm/entities/asset/orderable-asset.entity";
import { ProfileAsset } from "@/orm/entities/profile/profile-asset.entity";
import { ProjectAsset } from "@/orm/entities/project/project-asset.entity";
import { SkillAsset } from "@/orm/entities/skill/skill-asset.entity";
import { ormService } from "@/orm/orm.service";
import { patchEntity } from "@/orm/utils/patch-entity";
import { listQueryBuilder } from "../helpers/list-query-builder.service";
import { translatableSaver } from "../helpers/translatable-saver/translatable-saver.service";
import { translator } from "../helpers/translator.service";
import { tagService } from "./tag.service";

type NormalizedMimeType = {
  type: string;
  subtype: string;
};

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
    const currentLanguageCode = await getCurrentLocale();
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
        qb.andWhere("asset.__translations.name LIKE :name", {
          name: `%${typeof name === "string" ? name.trim() : name}%`,
        });
      }
    }
    return await qb.getManyAndCount().then((result) => {
      return {
        items: result[0].flatMap((asset) =>
          translator.translate(currentLanguageCode as LanguageCode, asset),
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

  public async create(ctx: RequestContext, input: CreateAssetInputSchema) {
    const allowedFileTypes = ["image/*", ".pdf", "video/*"];

    const normalizedMimeTypes = this.normalizeFileTypes(allowedFileTypes);

    // 1. validate mimetype and get asset type
    const isValidMimetype = this.validateMimeType(
      input.sourceFileMimetype,
      normalizedMimeTypes,
    );
    if (!isValidMimetype) {
      throw new UserInputError("Invalid mimetype", {
        mimeType: input.sourceFileMimetype,
        fileName: input.sourceFilename,
      });
    }
    const type = this.getAssetType(input.sourceFileMimetype);

    // 2. calculate dimensions
    const fileBuffer = await this.getFileAsBuffer(
      type === AssetType.IMAGE ? input.sourceFileKey : input.previewFileKey,
    );
    const dimensions = this.calculateDimensions(fileBuffer);

    const repo = await ormService.getRepository(ctx, Asset);

    const newAsset = new Asset({
      sourceIdentifier: input.sourceIdentifier,
      previewIdentifier: input.previewIdentifier,
      width: dimensions.width,
      height: dimensions.height,
      mimetype: input.sourceFileMimetype,
      type: type,
      fileSize: input.sourceFileSize,
      sourceFileKey: input.sourceFileKey,
      previewFileKey: input.previewFileKey,
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
        await utApi.deleteFiles([asset.sourceFileKey, asset.previewFileKey]);
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

  private validateMimeType(
    mimetype: string,
    allowedMimeTypes: NormalizedMimeType[],
  ): boolean {
    const [type, subtype] = mimetype.split("/");
    const typeMatches = allowedMimeTypes.filter((t) => t.type === type);

    for (const typeMatch of typeMatches) {
      if (typeMatch.subtype === subtype || typeMatch.subtype === "*") {
        return true;
      }
    }

    return false;
  }

  private getAssetType(mimeType: string): AssetType {
    const type = mimeType.split("/")[0];
    switch (type) {
      case "image":
        return AssetType.IMAGE;
      case "video":
        return AssetType.VIDEO;
      default:
        return AssetType.BINARY;
    }
  }

  private normalizeFileTypes(
    allowedFileTypes: string[],
  ): Array<NormalizedMimeType> {
    const extensionRegex = /\.[\w]+/;

    const mimeTypes = allowedFileTypes
      .map((fileType) => {
        return extensionRegex.test(fileType)
          ? mime.lookup(fileType) || undefined
          : fileType;
      })
      .filter(notNullOrUndefined)
      .map((mimetype) => {
        const [type, subtype] = mimetype.split("/");
        return {
          type,
          subtype,
        };
      });

    return mimeTypes;
  }

  private async getFileAsBuffer(fileKey: string) {
    // 1. Get the file URL using the file key
    const fileUrl = `https://${process.env.UPLOADTHING_APP_ID}.ufs.sh/f/${fileKey}`;

    // 2. Fetch the file data from the URL
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new InternalServerError(
        `Failed to fetch file: ${response.statusText}`,
      );
    }

    // 3. Convert the response to an ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // 4. Convert the ArrayBuffer to a Node.js Buffer
    const buffer = Buffer.from(arrayBuffer);

    return buffer;
  }

  private calculateDimensions(imageFile: Buffer): {
    width: number;
    height: number;
  } {
    try {
      const { width, height } = imageSize(
        imageFile as Uint8Array<ArrayBufferLike>,
      );
      return {
        width: width ?? 0,
        height: height ?? 0,
      };
    } catch (e: any) {
      console.error(
        `Could not determine Asset dimensions: ${JSON.stringify(e)}`,
      );
      return {
        width: 0,
        height: 0,
      };
    }
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
        default:
          throw new InternalServerError(
            "Couldn't find matching orderable asset",
          );
      }
    }
    return assetRelation.type as ClassType<OrderableAsset>;
  }
}
export const assetService = new AssetService();
