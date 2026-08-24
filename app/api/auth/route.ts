import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
import { serverConfig } from "@/lib/config/server-config";
import { authenticateAdminUserInputSchema } from "@/lib/dto/auth";
import { clientSafeSchema } from "@/lib/dto/profile";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { authService } from "@/services/domain/auth.service";

export const { POST, PATCH } = createRouter({
  POST: {
    authenticatedOnly: false,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedBody = validateInput(body, authenticateAdminUserInputSchema);

      const result = await authService.authenticateAdminUser(ctx, parsedBody);

      (await cookies()).set(serverConfig.sessionKey, result.token, {
        httpOnly: true,
        path: "/",
      });

      const parsedOutput = validateOutput(result.profile, clientSafeSchema);

      return NextResponse.json(parsedOutput, { status: 200 });
    },
  },
  PATCH: {
    authenticatedOnly: true,
    handler: async (_req, _, ctx) => {
      const res: { success: boolean } = { success: false };
      if (ctx.session?.token) {
        await authService.logoutAdminUser(ctx, { token: ctx.session.token });
        (await cookies()).delete("session");
        res.success = true;
      }
      return NextResponse.json(res, { status: 200 });
    },
  },
});
