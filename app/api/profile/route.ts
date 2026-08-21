import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
import { clientSafeSchema, updateProfileInputSchema } from "@/lib/dto/profile";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { profileService } from "@/services/domain/profile.service";

export const { PATCH } = createRouter({
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateProfileInputSchema);

      const result = await profileService.update(ctx, parsedData);

      const parsedOutput = validateOutput(result, clientSafeSchema);

      return NextResponse.json(parsedOutput, { status: 200 });
    },
  },
});
