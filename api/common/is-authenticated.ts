import { sessionService } from "@/services/domain/session.service";
import { getSessionToken } from "./session-utils";

export async function isAuthenticated() {
  const sessionToken = await getSessionToken();
  if (sessionToken) {
    const session = await getSessionFromToken(sessionToken);
    return !!session;
  }
  return false;
}

async function getSessionFromToken(token: string) {
  const cachedSession = await sessionService.getSessionByToken(token);
  if (cachedSession) return cachedSession;
}
