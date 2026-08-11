import createI18nMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createI18nMiddleware(routing);

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)"],
};
