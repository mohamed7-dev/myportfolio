import ms from "ms";
import { RequestContext } from "@/api/request-context/request-context";
import { serverConfig } from "@/lib/config/server-config";
import type { SessionCacheEntry } from "@/lib/config/session-cache-strategy.interface";
import { sharedConfig } from "@/lib/config/shared-config";
import type { LanguageCode } from "@/lib/dto/language-code";
import type { Profile } from "@/orm/entities/profile/profile.entity";

class RequestContextService {
  public async create(options: {
    req?: Request;
    languageCode?: LanguageCode;
    profile?: Profile;
    session?: SessionCacheEntry;
  }) {
    const { languageCode, req, profile, session: existingSession } = options;

    let session: SessionCacheEntry | undefined;

    if (existingSession) {
      session = existingSession;
    } else if (profile) {
      session = {
        user: {
          id: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          featuredAsset: profile.featuredAsset as any,
        },
        id: "__dummy_session_id__",
        token: "__dummy_session_token__",
        expiresAt: new Date(Date.now() + ms("1y")),
        cacheExpiry: ms("1y"),
      };
    }

    return new RequestContext({
      languageCode,
      req,
      session,
    });
  }

  public async buildFromReq(req: Request, session?: SessionCacheEntry) {
    const languageCode = this.extractLanguageCode(req);
    return new RequestContext({
      languageCode,
      req,
      session,
    });
  }

  private extractLanguageCode(req: Request): LanguageCode {
    const languageCode = req.headers.get(
      sharedConfig.api.languageCodeHeaderName,
    );

    if (languageCode) {
      return languageCode as LanguageCode;
    }

    return serverConfig.defaultLanguageCode;
  }
}

export const requestContextService = new RequestContextService();
