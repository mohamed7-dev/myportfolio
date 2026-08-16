import type { UploadRequest } from "../config/object-storage-strategy.interface";

export type UploadFileOptions = {
  file: File;
  request: UploadRequest;
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
};

export function uploadFile({
  file,
  request,
  signal,
  onProgress,
}: UploadFileOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(request.method, request.url);

    if (request.headers) {
      for (const [name, value] of Object.entries(request.headers)) {
        xhr.setRequestHeader(name, value);
      }
    }

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }

      const progress = Math.round((event.loaded / event.total) * 100);

      onProgress?.(progress);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }

      reject(new Error(`Upload failed with status ${xhr.status}`));
    };

    xhr.onerror = () => {
      reject(new Error("Network error while uploading file."));
    };

    xhr.onabort = () => {
      reject(new DOMException("Upload aborted.", "AbortError"));
    };

    signal?.addEventListener("abort", () => xhr.abort(), { once: true });

    const body =
      request.method === "POST"
        ? createMultipartBody(request.fields ?? {}, file)
        : file;

    xhr.send(body);
  });
}

function createMultipartBody(
  fields: Record<string, string>,
  file: File,
): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }

  formData.append("file", file);

  return formData;
}
