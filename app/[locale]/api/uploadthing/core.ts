import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { authService } from "@/services/domain/auth.service";
import { requestContextService } from "@/services/helpers/request-context.service";

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
    .middleware(async (req) => {
      // This code RUNS ON YOUR SERVER before upload
      const ctx = await requestContextService.create(req.req, undefined, true);

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
    .middleware(async (meta) => {
      // This code RUNS ON YOUR SERVER before upload

      const ctx = await requestContextService.create(meta.req, undefined, true);
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
