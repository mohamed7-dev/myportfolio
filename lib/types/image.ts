export interface AssetLike {
  id: string;
  previewIdentifier: string;
  name?: string | null;
}

export type ImagePreset =
  | "icon"
  | "tiny"
  | "thumb"
  | "small"
  | "medium"
  | "large"
  | "full"
  | null;

export type ImageFormat = "jpg" | "jpeg" | "png" | "webp" | "avif" | null;

export type ImageMode = "crop" | "resize" | null;
