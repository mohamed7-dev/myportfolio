import type { NextRequest, NextResponse } from "next/server";
import { authorize } from "@/lib/helpers/authorize";
import { handleApiErrors } from "@/lib/helpers/handle-api-errors";
import type { NextCtx } from "@/lib/types/shared-types";
import { ormService } from "@/orm/orm.service";
import { transactionManager } from "@/orm/transaction-manager";
import { requestContextService } from "@/services/helpers/request-context.service";
import type { RequestContext } from "../request-context/request-context";

type RouteHandler<TCtx = unknown> = (
  req: NextRequest,
  ctx: TCtx,
  requestContext: RequestContext,
) => Promise<NextResponse>;

type ServiceHandler<TArgs extends unknown[] = [], TResult = unknown> = (
  requestContext: RequestContext,
  ...args: TArgs
) => Promise<TResult>;

async function executeWithRequestContext<TResult, TCtx extends NextCtx>({
  req,
  authenticatedOnly = true,
  work,
  ctx,
}: {
  req?: NextRequest;
  authenticatedOnly?: boolean;
  work(requestContext: RequestContext): Promise<TResult>;
  ctx?: TCtx;
}) {
  const requestContext = await requestContextService.create(
    req,
    ctx,
    authenticatedOnly,
  );

  if (authenticatedOnly) {
    await authorize(requestContext);
  }

  const dataSource = await ormService.getDataSource();

  return transactionManager.executeInTransaction({
    requestContext,
    dataSource,
    work,
  });
}

function wrapRoute<TCtx extends NextCtx>({
  handler,
  authenticatedOnly = true,
}: {
  handler: RouteHandler<TCtx>;
  authenticatedOnly?: boolean;
}): (req: NextRequest, ctx: TCtx) => Promise<NextResponse> {
  return async (req, ctx) => {
    try {
      return await executeWithRequestContext({
        req,
        authenticatedOnly,
        work: (requestContext) => handler(req, ctx, requestContext),
        ctx,
      });
    } catch (error) {
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
