import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { imageSize } from "image-size";
import {
  type CreateUploadRequestInput,
  type ObjectLocation,
  type ObjectMetadata,
  type ObjectStorage,
  type ObjectStorageResourceType,
  toObjectKey,
  type UploadRequest,
} from "./object-storage-strategy.interface";

type SidecarMeta = {
  contentType: string;
  resourceType: ObjectStorageResourceType;
  uploadedAt: string;
  width: number;
  height: number;
};

export class LocalObjectStorage implements ObjectStorage {
  constructor(
    private readonly baseDir: string,
    private readonly uploadUrl: string,
    private readonly downloadUrlBase: string,
    private readonly signingSecret: string,
  ) {}

  createUploadRequest(input: CreateUploadRequestInput): Promise<UploadRequest> {
    return new Promise((resolve) => {
      resolve({
        url: this.uploadUrl,
        method: "POST",
        fields: {
          resourceType: input.resourceType,
          contentType: input.contentType,
          key: toObjectKey(input.location),
        },
      });
    });
  }

  async headObject(
    location: ObjectLocation,
    resourceType: ObjectStorageResourceType,
  ): Promise<ObjectMetadata | null> {
    const { filePath, metaPath } = resolveObjectPaths(this.baseDir, location);

    try {
      const [stat, meta] = await Promise.all([
        fs.stat(filePath),
        this.readSidecar(metaPath),
      ]);
      return {
        key: location.key,
        size: stat.size,
        contentType: meta?.contentType ?? "application/octet-stream",
        resourceType: meta?.resourceType ?? resourceType,
        metadata: meta ?? {},
      };
    } catch (error: any) {
      if (error?.code === "ENOENT") return null;
      throw error;
    }
  }

  async deleteObject(location: ObjectLocation): Promise<void> {
    const { filePath, metaPath } = resolveObjectPaths(this.baseDir, location);
    await Promise.all([
      fs.rm(filePath, { force: true }),
      fs.rm(metaPath, { force: true }),
    ]);
  }

  async createDownloadUrl(
    location: ObjectLocation,
    _resourceType: ObjectStorageResourceType,
    expiresInSeconds = 900,
  ): Promise<string> {
    const key = toObjectKey(location);
    const expires = String(Date.now() + expiresInSeconds * 1000);
    const signature = signPayload(`${key}:${expires}`, this.signingSecret);

    const url = new URL(this.downloadUrlBase);
    url.searchParams.set("key", key);
    url.searchParams.set("expires", expires);
    url.searchParams.set("signature", signature);
    return url.toString();
  }

  /** Called by the upload API route once it has the file bytes in hand. */
  async writeObject(
    location: ObjectLocation,
    data: Buffer,
    contentType: string,
    resourceType: ObjectStorageResourceType,
  ): Promise<void> {
    const { filePath, metaPath } = resolveObjectPaths(this.baseDir, location);
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    const meta: any = {
      contentType,
      resourceType,
      uploadedAt: new Date().toISOString(),
    };

    if (contentType.startsWith("image")) {
      const { width, height } = this.calculateDimensions(data);
      meta.width = width;
      meta.height = height;
    }

    await Promise.all([
      fs.writeFile(filePath, data),
      fs.writeFile(metaPath, JSON.stringify(meta)),
    ]);
  }

  private async readSidecar(metaPath: string): Promise<SidecarMeta | null> {
    try {
      const raw = await fs.readFile(metaPath, "utf-8");
      return JSON.parse(raw) as SidecarMeta;
    } catch {
      return null; // missing sidecar just means no contentType/resourceType override
    }
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
}

/**
 * Resolves an ObjectLocation to an absolute file path under baseDir, plus a
 * sidecar metadata path. Guards against path traversal via folder/key
 * segments containing "..", absolute paths, etc.
 */
export function resolveObjectPaths(baseDir: string, location: ObjectLocation) {
  const resolvedBase = path.resolve(baseDir);
  const relative = path.join(...location.folder, location.key);
  const filePath = path.resolve(resolvedBase, relative);

  if (
    filePath !== resolvedBase &&
    !filePath.startsWith(resolvedBase + path.sep)
  ) {
    throw new Error(
      `Invalid object location, resolves outside storage root: ${relative}`,
    );
  }

  return { filePath, metaPath: `${filePath}.meta.json` };
}

/** Reconstructs an ObjectLocation from the flattened "folder/.../key" string used on the wire. */
export function fromObjectKey(key: string): ObjectLocation {
  const segments = key.split("/").filter(Boolean);
  if (segments.length === 0) {
    throw new Error("Empty object key");
  }
  return { folder: segments.slice(0, -1), key: segments[segments.length - 1] };
}

export function signPayload(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifySignedUrl(
  key: string,
  expires: string,
  signature: string,
  secret: string,
): boolean {
  const expiresAt = Number(expires);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  const expected = signPayload(`${key}:${expires}`, secret);
  const expectedBuf = Buffer.from(expected);
  const providedBuf = Buffer.from(signature);

  if (expectedBuf.length !== providedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}
