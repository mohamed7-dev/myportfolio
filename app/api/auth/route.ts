import { createRouter } from "@/api/common/create-router";
import { getSessionToken, setSessionToken } from "@/api/common/session-utils";
import {
  authenticateAdminUserInputSchema,
  authenticateAdminUserOutputSchema,
} from "@/lib/dto/auth";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { authService } from "@/services/domain/auth.service";

export const { POST, PATCH } = createRouter({
  POST: {
    authenticatedOnly: false,
    handler: async (req, ctx) => {
      const body = await req.json();

      const parsedBody = validateInput(body, authenticateAdminUserInputSchema);
      const result = await authService.authenticate(ctx, parsedBody);

      const parsedOutput = validateOutput(
        result.profile,
        authenticateAdminUserOutputSchema,
      );

      await setSessionToken({
        sessionToken: result.token,
      });

      return { body: parsedOutput, init: { status: 200 } };
    },
  },
  PATCH: {
    authenticatedOnly: true,
    handler: async (_req, ctx) => {
      const res: { success: boolean } = { success: false };
      const sessionToken = await getSessionToken();

      if (!sessionToken) {
        res.success = false;
      } else {
        await authService.logoutAdminUser(ctx, { token: sessionToken });
        res.success = true;
        await setSessionToken({
          sessionToken: "",
        });
      }
      return { body: res, init: { status: 200 } };
    },
  },
});
