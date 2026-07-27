import "server-only";
import type { RequestContext } from "@/api/request-context/request-context";
import { authService } from "@/services/domain/auth.service";
import { ForbiddenError } from "../errors/errors";

export async function authorize(ctx: RequestContext) {
  const session = await authService.getSession(ctx);
  if (!session?.token) {
    throw new ForbiddenError();
  }
  return session;
}
