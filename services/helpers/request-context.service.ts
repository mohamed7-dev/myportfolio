import "server-only";
import type { NextRequest } from "next/server";
import { getLocale } from "next-intl/server";
import { RequestContext } from "@/api/request-context/request-context";
import type { LanguageCode } from "@/lib/dto/language-code";
import { authService } from "../domain/auth.service";

class RequestContextService {
  public async create(req?: NextRequest, requireSession = false) {
    const languageCode = (await getLocale()) as LanguageCode;

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
