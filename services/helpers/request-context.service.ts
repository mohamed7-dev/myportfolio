import type { NextRequest } from "next/server";
import { RequestContext } from "@/api/request-context/request-context";
import { serverConfig } from "@/lib/config/server-config";
import { LOCALE_HEADER } from "@/lib/constants";
import { languageCodeSchema } from "@/lib/dto/language-code";
import type { NextCtx } from "@/lib/types/shared-types";
import { authService } from "../domain/auth.service";

class RequestContextService {
  public async create<TCtx extends NextCtx>(
    req?: NextRequest,
    ctx?: TCtx,
    requireSession = false,
  ) {
    const languageCode = languageCodeSchema.parse(
      req?.headers.get(LOCALE_HEADER) ??
        (await ctx?.params)?.locale ??
        (await import("@/i18n/server")
          .then((mod) => mod.getCurrentLocale())
          .catch(() => serverConfig.defaultLanguageCode)) ??
        serverConfig.defaultLanguageCode,
    );

    if (!requireSession) {
      return new RequestContext({ languageCode, req });
    }

    const session = await authService.getSession(
      new RequestContext({ languageCode }),
    );

    return new RequestContext({
      languageCode,
      req,
      session: session as any,
      isAuthenticated: !!session?.token,
    });
  }
}

export const requestContextService = new RequestContextService();
