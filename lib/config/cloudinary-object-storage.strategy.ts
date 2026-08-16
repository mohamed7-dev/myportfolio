import { v2 as cloudinary } from "cloudinary";
import type {
  CreateUploadRequestInput,
  ObjectLocation,
  ObjectMetadata,
  ObjectStorage,
  ObjectStorageResourceType,
  UploadRequest,
} from "./object-storage-strategy.interface";

export class CloudinaryObjectStorage implements ObjectStorage {
  constructor(
    private readonly cloudName: string,
    private readonly apiKey: string,
    private readonly apiSecret: string,
  ) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  async createUploadRequest(
    input: CreateUploadRequestInput,
  ): Promise<UploadRequest> {
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        public_id: input.location.key,
        timestamp,
        folder: input.location.folder.join("/"),
      },
      this.apiSecret,
    );

    return {
      url: `https://api.cloudinary.com/v1_1/${this.cloudName}/${input.resourceType}/upload`,
      method: "POST",
      fields: {
        api_key: this.apiKey,
        public_id: input.location.key,
        timestamp: String(timestamp),
        signature,
        folder: input.location.folder.join("/"),
      },
    };
  }

  async headObject(
    location: ObjectLocation,
    resourceType: ObjectStorageResourceType,
  ): Promise<ObjectMetadata | null> {
    try {
      const key = this.toCloudinaryPublicId(location);
      const resource = await cloudinary.api.resource(key, {
        resource_type: resourceType,
      });

      return {
        key: location.key,
        size: resource.bytes,
        contentType: resource.format
          ? this.formatToMimeType(resource.format, resourceType)
          : "application/octet-stream",
        resourceType,
        metadata: resource,
      };
    } catch (error) {
      //   if (this.isNotFound(error)) {
      //     return null;
      //   }

      throw error;
    }
  }

  async deleteObject(
    location: ObjectLocation,
    resourceType: ObjectStorageResourceType,
  ): Promise<void> {
    await cloudinary.uploader.destroy(this.toCloudinaryPublicId(location), {
      resource_type: resourceType,
      invalidate: true,
    });
  }

  async createDownloadUrl(
    location: ObjectLocation,
    resourceType: ObjectStorageResourceType,
    expiresInSeconds = 900,
  ): Promise<string> {
    return cloudinary.url(this.toCloudinaryPublicId(location), {
      resource_type: resourceType,
      secure: true,
      sign_url: true,
    });
  }

  private toCloudinaryPublicId(location: ObjectLocation): string {
    return [...location.folder, location.key].join("/");
  }

  private formatToMimeType(format: string, resourceType: string) {
    return resourceType !== "raw" ? `${resourceType}/${format}` : format;
  }
}
