import "server-only";
import type { NextRequest } from "next/server";
import { getLocale } from "next-intl/server";
import { RequestContext } from "@/api/request-context/request-context";
import { appConfig } from "@/lib/config/app-config";
import type { LanguageCode } from "@/lib/dto/language-code";
import type { NextCtx } from "@/lib/types/shared-types";
import { authService } from "../domain/auth.service";

class RequestContextService {
  public async create<TCtx extends NextCtx>(
    req?: NextRequest,
    ctx?: TCtx,
    requireSession = false,
  ) {
    const languageCode = ctx
      ? ((await ctx.params)?.locale as LanguageCode)
      : ((await getLocale().catch(
          () => appConfig.defaultLanguageCode,
        )) as LanguageCode) || appConfig.defaultLanguageCode;

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
