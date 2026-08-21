/** biome-ignore-all lint/style/noNonNullAssertion: we do pre-check and throw errors*/
import path from "node:path";
import { LanguageCode } from "../dto/language-code";
import { isDevelopmentMode, registerEnv } from "../helpers/env";
import { apiRoutes } from "../helpers/router";
import { CloudinaryObjectStorage } from "./cloudinary-object-storage.strategy";
import { LocalObjectStorage } from "./local-object-storage.strategy";
import type { ObjectStorage } from "./object-storage-strategy.interface";

registerEnv();

interface ServerConfig {
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
  adminCredentials: {
    username: string;
    password: string;
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
  adminCredentials: {
    username: process.env.ADMIN_USERNAME ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
  },
};
