/** biome-ignore-all lint/style/noNonNullAssertion: we do pre-check and throw errors*/
import path from "node:path";
import { LanguageCode } from "../dto/language-code";
import { requireEnv } from "../helpers/env";
import { apiUrl } from "../helpers/router";
import { CloudinaryObjectStorage } from "./cloudinary-object-storage.strategy";
import { LocalObjectStorage } from "./local-object-storage.strategy";
import type { ObjectStorage } from "./object-storage-strategy.interface";

interface ServerConfig {
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
  uploadUrl: apiUrl("object-storage/upload"),
  downloadUrl: apiUrl("object-storage/download"),
  signingKey: "supersecretKey",
};

export const serverConfig: ServerConfig = {
  defaultLanguageCode: LanguageCode["en-US "],
  listQueryLimit: 100,
  asset: {
    localStorage,
    objectStorageStrategy:
      process.env.NODE_ENV === "development"
        ? new LocalObjectStorage(
            localStorage.baseDir,
            localStorage.uploadUrl,
            localStorage.downloadUrl,
            localStorage.signingKey,
          )
        : new CloudinaryObjectStorage(
            requireEnv(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME),
            requireEnv(process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY),
            requireEnv(process.env.CLOUDINARY_API_SECRET),
          ),
  },
  adminCredentials: {
    username: process.env.ADMIN_USERNAME ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
  },
};
