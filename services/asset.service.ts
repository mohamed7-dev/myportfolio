import { Asset } from "@/orm/entities/asset/asset.entity";
import "server-only";
import { imageSize } from "image-size";
import mime from "mime-types";
import { In } from "typeorm";
import { camelCase } from "typeorm/util/StringUtils.js";
import { getCurrentLocale } from "@/i18n/server";
import type {
  AssetType,
  CreateAssetInputSchema,
  DeleteAssetsInputSchema,
  UpdateAssetInputSchema,
} from "@/lib/dto/asset";
import type { DeletionResponse } from "@/lib/dto/common";
import type { LanguageCode } from "@/lib/dto/language-code";
import type { PaginatedListInputSchema } from "@/lib/dto/paginated-list";
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
import { ProjectAsset } from "@/orm/entities/project/project-asset.entity";
import { ormService } from "@/orm/orm.service";
import { patchEntity } from "@/orm/utils/patch-entity";
import { listQueryBuilder } from "./list-query-builder.service";
import { tagService } from "./tag.service";
import { translatableSaver } from "./translatable-saver/translatable-saver.service";
import { translator } from "./translator.service";

export interface EntityWithAssets extends AppEntity {
  featuredAsset: Asset | null;
  assets: OrderableAsset[];
}

export interface EntityAssetInput {
  assetIds?: string[] | null;
  featuredAssetId?: string | null;
}

export function assetService() {
  return {
    async createAsset(input: CreateAssetInputSchema) {
      const result = await _createAsset(input);
      if (input.tags) {
        // values => tags
        const tags = await tagService().createTagsFromValues(input.tags);
        result.tags = tags;
        const repo = await ormService.getRepository(Asset);
        await repo.save(result);
      }
      const translatedAsset = translator().translate(
        await getCurrentLocale(),
        result,
      );

      return translatedAsset;
    },
    async updateAsset(input: UpdateAssetInputSchema) {
      return await _updateAsset(input);
    },
    async deleteAssets(input: DeleteAssetsInputSchema["input"]) {
      return await _deleteAssets(input);
    },
    async assets(options: PaginatedListInputSchema) {
      return await _assets(options);
    },
    async asset(id: string) {
      return await _findOne(id);
    },
    async updateEntityFeaturedAsset<Entity extends EntityWithAssets>(
      entity: Entity,
      input: EntityAssetInput,
    ) {
      return await _updateEntityFeaturedAsset(entity, input);
    },
    async updateEntityAssets<Entity extends EntityWithAssets>(
      entity: Entity,
      input: EntityAssetInput,
    ) {
      return await _updateEntityAssets(entity, input);
    },
  };
}

async function _createAsset(input: CreateAssetInputSchema) {
  const allowedFileTypes = ["image/*", ".pdf", "video/*"];

  const normalizedMimeTypes = normalizeFileTypes(allowedFileTypes);

  // 1. validate mimetype and get asset type
  const isValidMimetype = validateMimeType(input.mimetype, normalizedMimeTypes);
  if (!isValidMimetype) {
    throw new UserInputError("Invalid mimetype", {
      mimeType: input.mimetype,
      fileName: input.filename,
    });
  }
  const type = getAssetType(input.mimetype);

  // 2. calculate dimensions
  const fileBuffer = await getFileAsBuffer(input.key);
  const dimensions = calculateDimensions(fileBuffer);

  const repo = await ormService.getRepository(Asset);

  const newAsset = new Asset({
    sourceIdentifier: input.sourceIdentifier,
    width: dimensions.width,
    height: dimensions.height,
    mimetype: input.mimetype,
    type: type,
    fileSize: input.size,
    fileKey: input.key,
  });

  const asset = await repo.save(newAsset);
  const defaultName = await getSourceFileName(input.filename);
  const currentLanguageCode = await getCurrentLocale();
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
        languageCode: currentLanguageCode,
        name: defaultName,
        base: asset,
      }),
    ];
  }

  const translationRepo = await ormService.getRepository(AssetTranslation);
  const savedTranslations = await translationRepo.save(assetTranslations);
  asset.translations = savedTranslations as any;

  return asset;
}

async function _updateAsset(input: UpdateAssetInputSchema) {
  const repo = await ormService.getRepository(Asset);
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
    asset.tags = await tagService().createTagsFromValues(input.tags);
  }
  const translationsInput = input.translations ?? [];
  const savedAsset = await repo.save(asset);
  if (translationsInput.length > 0) {
    await translatableSaver().update({
      input: { id: savedAsset.id, translations: translationsInput },
      entityType: Asset,
      translationEntityType: AssetTranslation,
    });
  }
  const translatedAsset = await _findOne(savedAsset.id);
  if (!translatedAsset) {
    throw new InternalServerError("Entity not found");
  }
  return translatedAsset;
}

async function _deleteAssets(
  input: DeleteAssetsInputSchema["input"],
): Promise<DeletionResponse[]> {
  const repo = await ormService.getRepository(Asset);
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
      await utApi.deleteFiles(asset.fileKey);
      await repo.remove(asset);
      return {
        result: "DELETED",
        message: "",
      };
    }),
  );
}

async function _assets(options: PaginatedListInputSchema) {
  const currentLanguageCode = await getCurrentLocale();
  return (await listQueryBuilder().build(Asset, options))
    .getManyAndCount()
    .then((result) => {
      return {
        items: result[0].flatMap((asset) =>
          translator().translate(currentLanguageCode as LanguageCode, asset),
        ),
        itemsCount: result[1],
      };
    });
}

async function _findOne(id: string) {
  const currentLanguageCode = await getCurrentLocale();
  const repo = await ormService.getRepository(Asset);
  return await repo
    .findOne({
      where: {
        id: id,
      },
    })
    .then((result) =>
      result ? translator().translate(currentLanguageCode, result) : undefined,
    );
}

async function getSourceFileName(filename: string): Promise<string> {
  let outputFileName: string | undefined;
  const assetNamingStrategy = new DefaultAssetNamingStrategy();

  const repo = await ormService.getRepository(AssetTranslation);

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
    outputFileName = assetNamingStrategy.createSourceName(filename, undefined);
  }

  return outputFileName;
}

type NormalizedMimeType = {
  type: string;
  subtype: string;
};

function validateMimeType(
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

export function getAssetType(mimeType: string): AssetType {
  const type = mimeType.split("/")[0];
  switch (type) {
    case "image":
      return "IMAGE";
    case "video":
      return "VIDEO";
    default:
      return "BINARY";
  }
}

function normalizeFileTypes(
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

async function getFileAsBuffer(fileKey: string) {
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

function calculateDimensions(imageFile: Buffer): {
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
    console.error(`Could not determine Asset dimensions: ${JSON.stringify(e)}`);
    return {
      width: 0,
      height: 0,
    };
  }
}

async function _updateEntityFeaturedAsset<Entity extends EntityWithAssets>(
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

  const featuredAsset = await _findOne(featuredAssetId);
  if (featuredAsset) {
    entity.featuredAsset = featuredAsset;
  }
  return entity;
}

async function _updateEntityAssets<Entity extends EntityWithAssets>(
  entity: Entity,
  input: EntityAssetInput,
) {
  if (!entity.id) {
    throw new InternalServerError("Entity must have an id");
  }
  const { assetIds } = input;
  const repo = await ormService.getRepository(Asset);
  if (assetIds?.length) {
    const assets = await repo.find({
      where: {
        id: In(assetIds),
      },
    });
    const sortedAssets = assetIds
      .map((id) => assets.find((a) => a.id === id))
      .filter(notNullOrUndefined);
    await removeExistingOrderableAssets(entity);
    if (sortedAssets.length > 0) {
      entity.assets = await createOrderableAssets(entity, sortedAssets);
    } else {
      entity.assets = [];
    }
  } else if (assetIds?.length === 0) {
    await removeExistingOrderableAssets(entity);
  }

  return entity;
}

async function createOrderableAssets(
  entity: EntityWithAssets,
  assets: Asset[],
) {
  const orderableAssets = await Promise.all(
    assets.map((asset, i) => getOrderableAsset(entity, asset, i)),
  );
  const repo = await ormService.getRepository(orderableAssets[0].constructor);

  return await repo.save(orderableAssets);
}

async function removeExistingOrderableAssets(entity: EntityWithAssets) {
  const relationProperty = getHostEntityRelationProperty(entity);
  const orderableAssetType = await getOrderableAssetType(entity);
  const repo = await ormService.getRepository(orderableAssetType);

  await repo.delete({
    [relationProperty]: {
      id: entity.id,
    },
  });
}

async function getOrderableAsset(
  entity: EntityWithAssets,
  asset: Asset,
  index: number,
): Promise<OrderableAsset> {
  const relationProperty = getHostEntityRelationProperty(entity);
  const orderableAssetType = await getOrderableAssetType(entity);
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

function getHostEntityRelationProperty(entity: EntityWithAssets): string {
  return camelCase(entity.constructor.name);
}

async function getOrderableAssetType(
  entity: EntityWithAssets,
): Promise<ClassType<OrderableAsset>> {
  const repo = await ormService.getRepository(entity.constructor);
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
      default:
        throw new InternalServerError("Couldn't find matching orderable asset");
    }
  }
  return assetRelation.type as ClassType<OrderableAsset>;
}
