import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
import { abortUploadSessionInputSchema } from "@/lib/dto/asset-upload";
import { isDevelopmentMode } from "@/lib/helpers/env";
import { validateInput } from "@/lib/helpers/validate-input";
import { assetService } from "@/services/domain/asset.service";

export const { PATCH } = createRouter({
  PATCH: {
    authenticatedOnly: isDevelopmentMode() ? false : true,
    handler: async (_, nextCtx, ctx) => {
      const { id } = await nextCtx.params;
      const parsedInput = validateInput(
        { uploadSessionId: id },
        abortUploadSessionInputSchema,
      );
      await assetService.abortUpload(ctx, parsedInput);
      return new NextResponse(null, { status: 204 });
    },
  },
});
