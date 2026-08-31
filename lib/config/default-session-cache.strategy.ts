import { cacheService } from "@/services/helpers/cache.service";
import type { JSONCompatible } from "../types/shared-types";
import type {
  SessionCacheEntry,
  SessionCacheStrategy,
} from "./session-cache-strategy.interface";

interface DefaultSessionCacheStrategyOptions {
  ttl?: number;
  prefix?: string;
}

export class DefaultSessionCacheStrategy implements SessionCacheStrategy {
  private readonly tags = ["DefaultSessionCacheStrategy"];

  constructor(private options?: DefaultSessionCacheStrategyOptions) {}

  public async set(serializedSession: SessionCacheEntry): Promise<void> {
    await cacheService.store(
      this.buildKey(serializedSession.token),
      this.prepareForStorage(serializedSession),
      {
        ttlInMs: this.options?.ttl ? this.options.ttl : 24 * 60 * 60 * 1000, // 1 day
        tags: this.tags,
      },
    );
  }

  public async get(
    sessionToken: string,
  ): Promise<SessionCacheEntry | undefined> {
    const cacheEntry = await cacheService.retrieve<
      JSONCompatible<SessionCacheEntry>
    >(this.buildKey(sessionToken));
    return cacheEntry ? this.retrieveFromStorage(cacheEntry) : undefined;
  }

  public async delete(sessionToken: string): Promise<void> {
    return await cacheService.delete(this.buildKey(sessionToken));
  }

  public async clear(): Promise<void> {
    return await cacheService.purgeByTags(this.tags);
  }

  private prepareForStorage(
    sessionEntry: SessionCacheEntry,
  ): JSONCompatible<SessionCacheEntry> {
    return {
      ...sessionEntry,
      expiresAt: sessionEntry.expiresAt.toISOString(),
    } as JSONCompatible<SessionCacheEntry>;
  }

  private retrieveFromStorage(
    sessionEntry: JSONCompatible<SessionCacheEntry>,
  ): SessionCacheEntry {
    return {
      ...sessionEntry,
      expiresAt: new Date(sessionEntry.expiresAt),
    } as SessionCacheEntry;
  }

  private buildKey(token: string): string {
    return `${this.options?.prefix ?? "session-cache"}:${token}`;
  }
}
