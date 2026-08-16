import { z } from "../../lib/helpers/zod";

export enum LanguageCode {
  "en-US " = "en-US",
  "ar-EG" = "ar-EG",
}

export const languageCodeSchema = z.nativeEnum(LanguageCode);
