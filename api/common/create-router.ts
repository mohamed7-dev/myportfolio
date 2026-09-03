import { type NextRequest, NextResponse } from "next/server";
import { serverConfig } from "@/lib/config/server-config";
import type { SessionCacheEntry } from "@/lib/config/session-cache-strategy.interface";
import { languageCodeSchema } from "@/lib/dto/language-code";
import { ForbiddenError } from "@/lib/errors/errors";
import { handleApiErrors } from "@/lib/helpers/handle-api-errors";
import type { NextCtx } from "@/lib/types/shared-types";
import { ormService } from "@/orm/orm.service";
import { transactionManager } from "@/orm/transaction-manager";
import { sessionService } from "@/services/domain/session.service";
import { requestContextService } from "@/services/helpers/request-context.service";
import type { RequestContext } from "../request-context/request-context";
import { getSessionToken, setSessionToken } from "./session-utils";

type RouteHandler<TCtx = unknown> = (
  req: Request,
  requestContext: RequestContext,
  headers: Headers,
  ctx: TCtx,
) => Promise<{ body: any; init: ResponseInit }>;

type ServiceHandler<TArgs extends unknown[] = [], TResult = unknown> = (
  requestContext: RequestContext,
  ...args: TArgs
) => Promise<TResult>;

type ExecutionContext =
  | {
      type: "route";
      req: Request;
      headers: Headers;
    }
  | {
      type: "server";
    };

async function executeWithRequestContext<TResult, TCtx extends NextCtx>({
  executionContext,
  authenticatedOnly = true,
  work,
}: {
  executionContext: ExecutionContext;
  authenticatedOnly?: boolean;
  work(requestContext: RequestContext): Promise<TResult>;
  ctx?: TCtx;
}) {
  let reqContext: RequestContext;
  // API Context
  if (executionContext.type === "route") {
    // API Context
    const session = await getSession();
    reqContext = await requestContextService.buildFromReq(
      executionContext.req,
      session,
    );
  } else {
    // Non API Context
    const languageCode = languageCodeSchema.parse(
      (await import("@/i18n/server")
        .then((mod) => mod.getCurrentLocale())
        .catch(() => serverConfig.defaultLanguageCode)) ??
        serverConfig.defaultLanguageCode,
    );

    let session: SessionCacheEntry | undefined;
    if (authenticatedOnly) {
      session = await getSession();
    }
    reqContext = await requestContextService.create({
      languageCode,
      session,
    });
  }
  await authorize(reqContext, authenticatedOnly);

  const dataSource = await ormService.getDataSource();

  return transactionManager.executeInTransaction({
    requestContext: reqContext,
    dataSource,
    work,
  });
}

async function getSession(): Promise<SessionCacheEntry | undefined> {
  const sessionToken = await getSessionToken();
  let cachedSession: SessionCacheEntry | undefined;
  if (sessionToken) {
    cachedSession = await sessionService.getSessionByToken(sessionToken);
    if (cachedSession) return cachedSession;
    // if there is a token but it cannot be validated to a Session,
    // then the token is no longer valid and should be unset.
    await setSessionToken({
      sessionToken: "",
    });
  }
  return cachedSession;
}

async function authorize(ctx: RequestContext, authenticatedOnly: boolean) {
  if (authenticatedOnly && !ctx.activeUserId) {
    throw new ForbiddenError();
  }
}

function wrapRoute<TCtx extends NextCtx>({
  handler,
  authenticatedOnly = true,
}: {
  handler: RouteHandler<TCtx>;
  authenticatedOnly?: boolean;
}): (req: NextRequest, ctx: TCtx) => Promise<NextResponse> {
  return async (req, ctx) => {
    const headers = new Headers();
    try {
      const result = await executeWithRequestContext({
        executionContext: {
          type: "route",
          req,
          headers,
        },
        authenticatedOnly,
        work: (requestContext) => handler(req, requestContext, headers, ctx),
        ctx,
      });
      return NextResponse.json(result.body, {
        ...result.init,
        headers: headers,
      });
    } catch (error) {
      console.log("Error From WrapRoute", error);
      return handleApiErrors(error);
    }
  };
}

export function wrapService<
  TArgs extends unknown[],
  TResult,
  TCtx extends NextCtx,
>({
  handler,
  authenticatedOnly = true,
  ctx,
}: {
  handler: ServiceHandler<TArgs, TResult>;
  authenticatedOnly?: boolean;
  ctx?: TCtx;
}) {
  return async (...args: TArgs): Promise<TResult> => {
    return executeWithRequestContext({
      executionContext: {
        type: "server",
      },
      authenticatedOnly,
      work: (requestContext) => handler(requestContext, ...args),
      ctx,
    });
  };
}

interface RouteConfiguration<TCtx> {
  handler: RouteHandler<TCtx>;
  authenticatedOnly?: boolean;
}

interface RouterDefinition<TCtx> {
  GET?: RouteConfiguration<TCtx>;
  POST?: RouteConfiguration<TCtx>;
  PUT?: RouteConfiguration<TCtx>;
  PATCH?: RouteConfiguration<TCtx>;
  DELETE?: RouteConfiguration<TCtx>;
}
export function createRouter<TCtx extends NextCtx>(
  routes: RouterDefinition<TCtx>,
) {
  return {
    GET: routes.GET && wrapRoute(routes.GET),
    POST: routes.POST && wrapRoute(routes.POST),
    PUT: routes.PUT && wrapRoute(routes.PUT),
    PATCH: routes.PATCH && wrapRoute(routes.PATCH),
    DELETE: routes.DELETE && wrapRoute(routes.DELETE),
  };
}
