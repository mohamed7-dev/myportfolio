import { z } from "@/lib/helpers/zod";

export const languageCodeSchema = z.enum(["en", "ar"]);

export type LanguageCode = z.infer<typeof languageCodeSchema>;
