import type { NextRequest } from "next/server";
import { createI18nMiddleware } from "next-international/middleware";
import { i18nConfig } from "./i18n/config";

const I18nMiddleware = createI18nMiddleware({
  defaultLocale: i18nConfig.defaultLocale,
  locales: i18nConfig.locales.map((locale) => locale.key),
});

export function proxy(request: NextRequest) {
  return I18nMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
