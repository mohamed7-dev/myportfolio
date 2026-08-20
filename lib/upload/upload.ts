import type { UploadRequest } from "../config/object-storage-strategy.interface";

export type UploadFileOptions = {
  file: {
    data: File | Blob;
    name: string;
  };
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
        ? createMultipartBody(request.fields ?? {}, file.data, file.name)
        : file.data;

    xhr.send(body);
  });
}

export async function seedFile({
  file,
  request,
}: Omit<UploadFileOptions, "signal" | "onProgress">): Promise<void> {
  const headers = new Headers(request.headers);

  let body: BodyInit = file.data;
  if (request.method === "POST") {
    const multipart = await createSeedMultipartBody(
      request.fields ?? {},
      file.data,
      file.name,
    );
    body = multipart.body;
    headers.set("Content-Type", multipart.contentType);
  }

  const res = await fetch(request.url, {
    method: request.method,
    headers,
    body,
  });

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
  }

  await res.json();
}

async function createSeedMultipartBody(
  fields: Record<string, string>,
  file: File | Blob,
  name: string,
): Promise<{ body: Blob; contentType: string }> {
  const boundary = `----portfolio-upload-${crypto.randomUUID()}`;
  const parts: BlobPart[] = [];

  for (const [key, value] of Object.entries(fields)) {
    parts.push(
      `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`,
    );
  }

  parts.push(
    `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${name}"\r\nContent-Type: ${file.type || "application/octet-stream"}\r\n\r\n`,
    file,
    `\r\n--${boundary}--\r\n`,
  );

  return {
    body: new Blob(parts),
    contentType: `multipart/form-data; boundary=${boundary}`,
  };
}

function createMultipartBody(
  fields: Record<string, string>,
  file: File | Blob,
  name: string,
): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }

  formData.append("file", file, name);

  return formData;
}
