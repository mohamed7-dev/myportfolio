import mime from "mime-types";
import { notNullOrUndefined } from "./not-null-or-undefined";

export type NormalizedMimeType = {
  type: string;
  subtype: string;
};

export function normalizeFileTypes(
  allowedFileTypes: string[],
): Array<NormalizedMimeType> {
  const extensionRegex = /\.[\w]+/;

  const mimeTypes = allowedFileTypes
    .map((fileType) => {
      return extensionRegex.test(fileType)
        ? mime.lookup(fileType) || undefined
        : fileType;
    })
    .filter(notNullOrUndefined)
    .map((mimetype) => {
      const [type, subtype] = mimetype.split("/");
      return {
        type,
        subtype,
      };
    });

  return mimeTypes;
}
