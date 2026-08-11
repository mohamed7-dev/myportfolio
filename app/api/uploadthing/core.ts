import { getLocale } from "next-intl/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { RequestContext } from "@/api/request-context/request-context";
import type { LanguageCode } from "@/lib/dto/language-code";
import { authService } from "@/services/domain/auth.service";

const f = createUploadthing();

export const ourFileRouter = {
  assetUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
    video: {
      maxFileSize: "32MB",
      maxFileCount: 1,
    },
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code RUNS ON YOUR SERVER before upload
      const ctx = new RequestContext({
        languageCode: (await getLocale()) as LanguageCode,
      });
      const session = await authService.getSession(ctx);

      // If you throw, the user will not be able to upload
      if (!session?.token) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      // This code RUNS ON YOUR SERVER after upload

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {
        fileUrl: file.ufsUrl,
        fileSize: file.size,
        fileMimeType: file.type,
        fileKey: file.key,
      };
    }),
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      // This code RUNS ON YOUR SERVER before upload

      const ctx = new RequestContext({
        languageCode: (await getLocale()) as LanguageCode,
      });
      const session = await authService.getSession(ctx);

      // If you throw, the user will not be able to upload
      if (!session?.token) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      // This code RUNS ON YOUR SERVER after upload

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {
        fileUrl: file.ufsUrl,
        fileSize: file.size,
        fileMimeType: file.type,
        fileKey: file.key,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
