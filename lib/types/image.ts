export interface AssetLike {
  id: string;
  previewIdentifier: string;
  sourceIdentifier: string;
  name?: string | null;
  width?: number;
  height?: number;
  mimetype?: string;
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
