export enum ObjectStorageResourceType {
  image = "image",
  video = "video",
  raw = "raw",
}
export type ObjectLocation = {
  folder: readonly string[];
  key: string;
};
export type CreateUploadRequestInput = {
  location: ObjectLocation;
  contentType: string;
  contentLength: number;
  expiresInSeconds?: number;
  resourceType: ObjectStorageResourceType;
};

export type UploadRequest = {
  url: string;
  method: "PUT" | "POST";
  headers?: Record<string, string>;
  fields?: Record<string, string>;
};

export type ObjectMetadata = {
  key: string;
  size: number;
  contentType: string;
  resourceType: ObjectStorageResourceType;
  metadata: Record<string, unknown>;
};

export interface ObjectStorage {
  createUploadRequest(input: CreateUploadRequestInput): Promise<UploadRequest>;

  headObject(
    location: ObjectLocation,
    resourceType: ObjectStorageResourceType,
  ): Promise<ObjectMetadata | null>;

  deleteObject(
    location: ObjectLocation,
    resourceType: ObjectStorageResourceType,
  ): Promise<void>;

  createDownloadUrl(
    location: ObjectLocation,
    resourceType: ObjectStorageResourceType,
    expiresInSeconds?: number,
  ): Promise<string>;
}

export function toObjectKey(location: ObjectLocation) {
  return location.folder.concat(location.key).join("/");
}
