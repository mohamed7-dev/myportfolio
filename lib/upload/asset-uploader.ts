import type {
  CommitUploadSessionOutputSchema,
  CreateAssetUploadInputSchema,
  CreateAssetUploadOutputSchema,
} from "../dto/asset-upload";
import { isAppError } from "../errors/app-error";
import { api } from "../helpers/api";
import { apiRoutes } from "../helpers/router";
import type { UploadFileOptions } from "./upload";

export type UploadAssetInput = {
  source: { data: File | Blob; name: string };
  preview: { data: File | Blob; name: string };
  signal?: AbortSignal;
  onSourceProgress?: (progress: number) => void;
  onPreviewProgress?: (progress: number) => void;
  uploadHandler: (options: UploadFileOptions) => Promise<void>;
};

export type UploadAssetResult = {
  assetId: string;
};

export class AssetUploader {
  async upload(input: UploadAssetInput): Promise<UploadAssetResult> {
    // 1. create upload session
    const session = await this.createAssetUploadSession({
      source: {
        name: input.source.name,
        mimeType: input.source.data.type,
        size: input.source.data.size,
      },
      preview: {
        name: input.preview.name,
        mimeType: input.preview.data.type,
        size: input.preview.data.size,
      },
    });
    try {
      return await Promise.all([
        // 2. upload source
        input.uploadHandler({
          file: input.source,
          request: session.source.upload,
          signal: input.signal,
          onProgress: input.onSourceProgress,
        }),
        // 3. upload preview
        input.uploadHandler({
          file: input.preview,
          request: session.preview.upload,
          signal: input.signal,
          onProgress: input.onPreviewProgress,
        }),
      ]).then(async () => {
        // 4. complete session
        return await this.completeAssetUpload(session.uploadId);
      });
    } catch (error) {
      // Best-effort compensation.
      try {
        await this.abortAssetUpload(session.uploadId);
      } catch (abortError) {
        // Don't replace the original upload error.
        console.error(abortError);
      }
      throw error;
    }
  }

  private async createAssetUploadSession(input: CreateAssetUploadInputSchema) {
    const response = await api(
      apiRoutes.assets.createUploadSession,
      input,
      true,
    );

    if (!response.ok) {
      throw new Error(`Creating Upload Session Failed`);
    }
    const data = (await response.json()) as CreateAssetUploadOutputSchema;

    if (isAppError(data)) {
      throw data;
    }

    return data;
  }

  private async abortAssetUpload(id: string) {
    const response = await api(
      {
        ...apiRoutes.assets.abortUploadSession,
        url: apiRoutes.assets.abortUploadSession.url(id),
      },
      undefined,
      true,
    );
    if (!response.ok) {
      throw new Error(`Aborting Upload Session Failed`);
    }

    const data = (await response.json()) as undefined;

    if (isAppError(data)) {
      throw data;
    }

    return data;
  }

  private async completeAssetUpload(id: string) {
    const response = await api(
      {
        ...apiRoutes.assets.commitUploadSession,
        url: apiRoutes.assets.commitUploadSession.url(id),
      },
      undefined,
      true,
    );

    if (!response.ok) {
      throw new Error(`Committing upload Session Failed`);
    }
    const data = (await response.json()) as CommitUploadSessionOutputSchema;

    if (isAppError(data)) {
      throw data;
    }

    return data;
  }
}
