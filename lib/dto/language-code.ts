import { z } from "../../lib/helpers/zod";

export enum LanguageCode {
  en = "en",
  ar = "ar",
}

export const languageCodeSchema = z.nativeEnum(LanguageCode);
