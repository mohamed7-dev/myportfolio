import type { NextRequest } from "next/server";
import type { ReplicationMode } from "typeorm";
import { LanguageCode } from "@/lib/dto/language-code";
import type { Profile } from "@/lib/dto/profile";

interface RequestContextOptions {
  languageCode?: LanguageCode;
  req?: NextRequest;
  session?: ActiveSession;
  isAuthenticated?: boolean;
}

export type ActiveSession = { token: string; profile: Profile };

export class RequestContext {
  private _languageCode: LanguageCode;
  private _req?: NextRequest;
  private _session?: ActiveSession;
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

  get req(): NextRequest | undefined {
    return this._req;
  }

  get session(): ActiveSession | undefined {
    return this._session;
  }

  get activeUserId(): string | undefined {
    return this.session?.profile?.id;
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
