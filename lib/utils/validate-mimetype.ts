import type { NormalizedMimeType } from "./normalize-file-types";

export function validateMimeType(
  mimetype: string,
  allowedMimeTypes: NormalizedMimeType[],
): boolean {
  const [type, subtype] = mimetype.split("/");
  const typeMatches = allowedMimeTypes.filter((t) => t.type === type);

  for (const typeMatch of typeMatches) {
    if (typeMatch.subtype === subtype || typeMatch.subtype === "*") {
      return true;
    }
  }

  return false;
}
