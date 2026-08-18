/** biome-ignore-all lint/style/noNonNullAssertion: we do pre-check and throw errors*/
import { LanguageCode } from "../dto/language-code";
import { CloudinaryObjectStorage } from "./cloudinary-object-storage.strategy";
import type { ObjectStorage } from "./object-storage-strategy.interface";
import { UploadThingObjectStorage } from "./uploadthing-object-storage.strategy";

interface ServerConfig {
  defaultLanguageCode: LanguageCode;
  listQueryLimit: number;
  asset: {
    objectStorageStrategy: ObjectStorage;
  };
  adminCredentials: {
    username: string;
    password: string;
  };
}

export const serverConfig: ServerConfig = {
  defaultLanguageCode: LanguageCode["en-US "],
  listQueryLimit: 100,
  asset: {
    objectStorageStrategy:
      process.env.NODE_ENV === "development"
        ? new UploadThingObjectStorage(
            process.env.UPLOADTHING_TOKEN!,
            process.env.APP_URL!,
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
