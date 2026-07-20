import { cookies } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { profileService } from "@/services/profile.service";

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

      console.log(await cookies());
      const session = await profileService().getSession();

      // If you throw, the user will not be able to upload
      if (!session.token) throw new UploadThingError("Unauthorized");

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

      console.log(await cookies());
      const session = await profileService().getSession();

      // If you throw, the user will not be able to upload
      if (!session.token) throw new UploadThingError("Unauthorized");

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
