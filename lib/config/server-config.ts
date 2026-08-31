/** biome-ignore-all lint/style/noNonNullAssertion: we do pre-check and throw errors*/
import path from "node:path";
import { LanguageCode } from "../dto/language-code";
import { registerEnv } from "../helpers/env";
import { apiRoutes } from "../helpers/router";
import { isDevelopmentMode } from "../utils/is-env";
import type { CacheStrategy } from "./cache-strategy.interface";
import { CloudinaryObjectStorage } from "./cloudinary-object-storage.strategy";
import { DefaultSessionCacheStrategy } from "./default-session-cache.strategy";
import { InMemoryCacheStrategy } from "./in-memory-cache.strategy";
import { LocalObjectStorage } from "./local-object-storage.strategy";
import type { ObjectStorage } from "./object-storage-strategy.interface";
import type { SessionCacheStrategy } from "./session-cache-strategy.interface";

registerEnv();

export interface ServerConfig {
  sessionKey: string;
  defaultLanguageCode: LanguageCode;
  listQueryLimit: number;
  asset: {
    objectStorageStrategy: ObjectStorage;
    localStorage: {
      baseDir: string;
      downloadUrl: string;
      uploadUrl: string;
      signingKey: string;
    };
  };
  auth: {
    adminCredentials: {
      username: string;
      password: string;
    };
    sessionDurationInMs: number;
    sessionCacheTTLInMs: number;
    sessionCache: SessionCacheStrategy;
  };
  system: {
    cache: CacheStrategy;
  };
}

const localStorage = {
  baseDir: path.join(process.cwd(), "public", "object-storage"),
  uploadUrl: apiRoutes.objectStorage.upload.url,
  downloadUrl: apiRoutes.objectStorage.download.url(),
  signingKey: "supersecretKey",
};

export const serverConfig: ServerConfig = {
  sessionKey: "session",
  defaultLanguageCode: LanguageCode["en"],
  listQueryLimit: 100,
  asset: {
    localStorage,
    objectStorageStrategy: isDevelopmentMode()
      ? new LocalObjectStorage(
          localStorage.baseDir,
          localStorage.uploadUrl,
          localStorage.downloadUrl,
          localStorage.signingKey,
        )
      : new CloudinaryObjectStorage(
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
          process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
          process.env.CLOUDINARY_API_SECRET!,
        ),
  },
  auth: {
    adminCredentials: {
      username: process.env.ADMIN_USERNAME ?? "",
      password: process.env.ADMIN_PASSWORD ?? "",
    },
    /**
     * @default 1 year
     */
    sessionDurationInMs: 31_536_000_000,
    /**
     * @default 3 minutes
     */
    sessionCacheTTLInMs: 180_000,
    sessionCache: new DefaultSessionCacheStrategy(),
  },
  system: {
    cache: new InMemoryCacheStrategy(),
  },
};
