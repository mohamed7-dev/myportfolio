import type { ReplicationMode } from "typeorm";
import type { SessionCacheEntry } from "@/lib/config/session-cache-strategy.interface";
import { LanguageCode } from "@/lib/dto/language-code";

interface RequestContextOptions {
  languageCode?: LanguageCode;
  req?: Request;
  session?: SessionCacheEntry;
  isAuthenticated?: boolean;
}

export class RequestContext {
  private _languageCode: LanguageCode;
  private _req?: Request;
  private _session?: SessionCacheEntry;
  private _replicationMode?: ReplicationMode;
  private _isAuthenticated: boolean;

  constructor(options?: RequestContextOptions) {
    this._languageCode = options?.languageCode ?? LanguageCode["en"];
    this._req = options?.req;
    this._session = options?.session;
    this._isAuthenticated = options?.isAuthenticated ?? false;
  }

  get languageCode(): LanguageCode {
    return this._languageCode;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  get req(): Request | undefined {
    return this._req;
  }

  get session(): SessionCacheEntry | undefined {
    return this._session;
  }

  get activeUserId(): string | undefined {
    return this.session?.user.id;
  }

  setReplicationMode(mode: ReplicationMode): void {
    this._replicationMode = mode;
  }

  /**
   * @description
   * Indicates whether the current context is configured to deal with a master or replica database
   *
   * @default undefined
   */
  get replicationMode(): ReplicationMode | undefined {
    return this._replicationMode;
  }
}
