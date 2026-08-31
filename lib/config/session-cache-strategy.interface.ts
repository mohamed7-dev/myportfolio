import type { Asset } from "@/orm/entities/asset/asset.entity";
import type { Translated } from "../types/translatable";

export type CachedSessionUser = {
  id: string;
  username: string;
  displayName: string;
  featuredAsset: Translated<Asset>;
};

export interface SessionCacheEntry {
  id: string;
  token: string;
  expiresAt: Date;
  cacheExpiry: number;
  user: CachedSessionUser;
}

export interface SessionCacheStrategy {
  set(sessionEntry: SessionCacheEntry): Promise<void> | void;
  get(
    sessionToken: string,
  ): Promise<SessionCacheEntry | undefined> | SessionCacheEntry | undefined;
  delete(sessionToken: string): Promise<void> | void;
  clear(): Promise<void> | void;
}
