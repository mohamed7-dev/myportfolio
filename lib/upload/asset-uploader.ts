import type {
  CommitUploadSessionOutputSchema,
  CreateAssetUploadInputSchema,
  CreateAssetUploadOutputSchema,
} from "../dto/asset-upload";
import { apiUrl } from "../helpers/router";
import { uploadFile } from "./upload";

export type UploadAssetInput = {
  source: File;
  preview: File;
  signal?: AbortSignal;
  onSourceProgress?: (progress: number) => void;
  onPreviewProgress?: (progress: number) => void;
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
        mimeType: input.source.type,
        size: input.source.size,
      },
      preview: {
        name: input.preview.name,
        mimeType: input.preview.type,
        size: input.preview.size,
      },
    });
    try {
      return await Promise.all([
        // 2. upload source
        uploadFile({
          file: input.source,
          request: session.source.upload,
          signal: input.signal,
          onProgress: input.onSourceProgress,
        }),
        // 3. upload preview
        uploadFile({
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
    const response = await fetch(apiUrl("/assets/upload-session"), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      //   throw await parseApiError(response);
      throw new Error(
        `Creating Upload Session Failed With Error: (${response})`,
      );
    }

    return response.json() as Promise<CreateAssetUploadOutputSchema>;
  }

  private async abortAssetUpload(id: string) {
    const response = await fetch(apiUrl(`/assets/upload-session/${id}/abort`), {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      //   throw await parseApiError(response);
      throw new Error(
        `Aborting Upload Session Failed With Error: (${response})`,
      );
    }
  }

  private async completeAssetUpload(id: string) {
    const response = await fetch(
      apiUrl(`/assets/upload-session/${id}/commit`),
      {
        method: "POST",
        credentials: "include",
      },
    );

    if (!response.ok) {
      //   throw await parseApiError(response);
      throw new Error(
        `Committing upload Session Failed With Error: (${response})`,
      );
    }
    return response.json() as Promise<CommitUploadSessionOutputSchema>;
  }
}
