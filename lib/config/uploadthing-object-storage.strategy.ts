import { createHmac } from "node:crypto";
import { UTApi } from "uploadthing/server";
import {
  type CreateUploadRequestInput,
  type ObjectLocation,
  type ObjectMetadata,
  type ObjectStorage,
  ObjectStorageResourceType,
  type UploadRequest,
} from "./object-storage-strategy.interface";

type UploadThingFile = {
  key: string;
  name: string;
  size: number;
  type: string;
  url: string;
  customId?: string | null;
};

type UploadThingListResult = {
  files: UploadThingFile[];
  hasMore: boolean;
};

export class UploadThingObjectStorage implements ObjectStorage {
  private readonly api: UTApi;

  constructor(
    private readonly token: string,
    private readonly appUrl: string,
    private readonly uploadEndpoint = "/api/object-storage/upload",
  ) {
    this.api = new UTApi({
      token,
    });
  }

  async createUploadRequest(
    input: CreateUploadRequestInput,
  ): Promise<UploadRequest> {
    const expiresIn = input.expiresInSeconds ?? 900;

    const expiresAt = Date.now() + expiresIn * 1000;

    const key = this.toCustomId(input.location);

    const payload = JSON.stringify({
      key,
      contentType: input.contentType,
      contentLength: input.contentLength,
      resourceType: input.resourceType,
      expiresAt,
    });

    const { ufsUrl } = await this.api.generateSignedURL(key, {
      expiresIn: expiresIn,
    });

    const token = this.sign(payload);

    return {
      url: ufsUrl,
      method: "POST",
      //   headers: {
      //     "content-type": input.contentType,
      //     "content-length": String(input.contentLength),
      //     "x-object-storage-token": token,
      //   },
      fields: {
        key,
      },
    };
  }

  async headObject(
    location: ObjectLocation,
    resourceType: ObjectStorageResourceType,
  ): Promise<ObjectMetadata | null> {
    const customId = this.toCustomId(location);

    const result = await this.findByCustomId(customId);

    if (!result) {
      return null;
    }

    if (this.toResourceType(result.type) !== resourceType) {
      return null;
    }

    return {
      key: location.key,
      size: result.size,
      contentType: result.type,
      resourceType,
      metadata: {
        fileKey: result.key,
        customId: result.customId,
        name: result.name,
        url: result.url,
      },
    };
  }

  async deleteObject(
    location: ObjectLocation,
    resourceType: ObjectStorageResourceType,
  ): Promise<void> {
    const customId = this.toCustomId(location);

    const result = await this.findByCustomId(customId);

    if (!result) {
      return;
    }

    if (this.toResourceType(result.type) !== resourceType) {
      return;
    }

    await this.api.deleteFiles(result.key);
  }

  async createDownloadUrl(
    location: ObjectLocation,
    resourceType: ObjectStorageResourceType,
    expiresInSeconds = 900,
  ): Promise<string> {
    const customId = this.toCustomId(location);

    const result = await this.findByCustomId(customId);

    if (!result) {
      throw new Error(`UploadThing object not found: ${customId}`);
    }

    if (this.toResourceType(result.type) !== resourceType) {
      throw new Error(
        `UploadThing object "${customId}" has resource type "${this.toResourceType(
          result.type,
        )}", expected "${resourceType}"`,
      );
    }

    const { ufsUrl } = await this.api.generateSignedURL(result.key, {
      expiresIn: expiresInSeconds,
    });

    return ufsUrl;
  }

  private async findByCustomId(
    customId: string,
  ): Promise<UploadThingFile | null> {
    let offset = 0;

    while (true) {
      const result = (await this.api.listFiles({
        limit: 500,
        offset,
      })) as unknown as UploadThingListResult;

      const file = result.files.find((file) => file.customId === customId);

      if (file) {
        return file;
      }

      if (!result.hasMore || result.files.length === 0) {
        return null;
      }

      offset += result.files.length;
    }
  }

  private sign(payload: string): string {
    return createHmac("sha256", this.token).update(payload).digest("hex");
  }

  private toCustomId(location: ObjectLocation): string {
    return [...location.folder, location.key].filter(Boolean).join("/");
  }

  private toResourceType(contentType: string): ObjectStorageResourceType {
    if (contentType.startsWith("image/")) {
      return ObjectStorageResourceType.image;
    }

    if (contentType.startsWith("video/")) {
      return ObjectStorageResourceType.video;
    }

    return ObjectStorageResourceType.raw;
  }
}
