import "server-only";
import type { NextRequest } from "next/server";
import { RequestContext } from "@/api/request-context/request-context";
import { getCurrentLocale } from "@/i18n/server";
import { authService } from "../domain/auth.service";

class RequestContextService {
  public async create(req?: NextRequest) {
    const session = await authService.getSession(new RequestContext());
    return new RequestContext({
      languageCode: await getCurrentLocale(),
      req,
      session: session as any,
      isAuthenticated: !!session?.token,
    });
  }
}

export const requestContextService = new RequestContextService();
