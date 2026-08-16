import { defineRouting } from "next-intl/routing";
import { sharedConfig } from "@/lib/config/shared-config";

export const routing = defineRouting({
  locales: sharedConfig.i18n.locales.map((l) => l.key),
  defaultLocale: sharedConfig.i18n.defaultLocale,
});
