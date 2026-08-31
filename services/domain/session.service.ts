import { randomBytes } from "node:crypto";
import type { RequestContext } from "@/api/request-context/request-context";
import { serverConfig } from "@/lib/config/server-config";
import type { SessionCacheEntry } from "@/lib/config/session-cache-strategy.interface";
import { race } from "@/lib/helpers/race";
import type { Translated } from "@/lib/types/translatable";
import type { Asset } from "@/orm/entities/asset/asset.entity";
import type { Profile } from "@/orm/entities/profile/profile.entity";
import { Session } from "@/orm/entities/session/session.entity";
import { ormService } from "@/orm/orm.service";

class SessionService {
  public async getSessionByToken(
    sessionToken: string,
  ): Promise<SessionCacheEntry | undefined> {
    let cachedSession = await race(
      serverConfig.auth.sessionCache.get(sessionToken),
    );
    const isCacheStale = !!(
      cachedSession && cachedSession.cacheExpiry < Date.now()
    );
    const isSessionExpired = !!(
      cachedSession && cachedSession.expiresAt < new Date()
    );
    if (!cachedSession || isCacheStale || isSessionExpired) {
      const session = await this.getValidSessionByToken(sessionToken);
      if (session) {
        cachedSession = this.buildSessionCacheEntry(session);
        await race(serverConfig.auth.sessionCache.set(cachedSession));
        return cachedSession;
      } else {
        return;
      }
    }
    return cachedSession;
  }

  public async getValidSessionByToken(
    sessionToken: string,
  ): Promise<Session | undefined> {
    const repo = await ormService.getRepository(Session);
    const session = await repo
      .createQueryBuilder("session")
      .leftJoinAndSelect("session.profile", "profile")
      .where("session.revoked = false")
      .andWhere("session.token = :token", {
        token: sessionToken,
      })
      .getOne();

    if (session && session.expiresAt > new Date()) {
      return session;
    }
  }

  public async startSession(ctx: RequestContext, profile: Profile) {
    const token = await this.generateSessionToken();

    const expires = this.getExpiryDate(serverConfig.auth.sessionDurationInMs);

    const repo = await ormService.getRepository(ctx, Session);
    const session = new Session({
      token,
      profile,
      expiresAt: expires,
      revoked: false,
    });
    await repo.save(session);
    await race(
      serverConfig.auth.sessionCache.set(this.buildSessionCacheEntry(session)),
    );

    return session;
  }

  public async deleteSessions(
    ctx: RequestContext,
    profile: Profile,
  ): Promise<void> {
    const repo = await ormService.getRepository(ctx, Session);
    const userSessions = await repo.find({
      where: {
        profile: {
          id: profile.id,
        },
      },
    });
    await repo.remove(userSessions);
    for (const session of userSessions) {
      await race(serverConfig.auth.sessionCache.delete(session.token));
    }
  }

  private buildSessionCacheEntry(session: Session): SessionCacheEntry {
    const expiry = Date.now() + serverConfig.auth.sessionCacheTTLInMs;

    const sessionCacheEntry: SessionCacheEntry = {
      id: session.id,
      token: session.token,
      expiresAt: session.expiresAt,
      cacheExpiry: expiry,
      user: {
        username: session.profile.username,
        id: session.profile.id,
        displayName: session.profile.displayName,
        featuredAsset: session.profile.featuredAsset as Translated<Asset>,
      },
    };

    return sessionCacheEntry;
  }

  private getExpiryDate(timeToExpireInMs: number): Date {
    return new Date(Date.now() + timeToExpireInMs);
  }

  private async generateSessionToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      randomBytes(32, (err, buf) => {
        if (err) {
          reject(err);
        }
        resolve(buf.toString("hex"));
      });
    });
  }
}

export const sessionService = new SessionService();
