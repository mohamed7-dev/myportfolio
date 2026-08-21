import type { NextRequest } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";
import { sharedConfig } from "./lib/config/shared-config";

const I18nMiddleware = createI18nMiddleware({
  locales: sharedConfig.i18n.locales.map((l) => l.key),
  defaultLocale: sharedConfig.i18n.defaultLocale,
});

export function proxy(request: NextRequest) {
  return I18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
