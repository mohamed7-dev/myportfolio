import { cookies } from "next/headers";
import { sharedConfig } from "@/lib/config/shared-config";

export async function setSessionToken(options: {
  sessionToken: string;
}): Promise<void> {
  const { sessionToken } = options;

  if (!sessionToken.length) {
    (await cookies()).delete(sharedConfig.api.authTokenCookieName);
  }

  (await cookies()).set(sharedConfig.api.authTokenCookieName, sessionToken);
}

export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(sharedConfig.api.authTokenCookieName)?.value;
}
