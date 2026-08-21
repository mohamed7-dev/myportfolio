import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
import {
  commitUploadSessionInputSchema,
  commitUploadSessionOutputSchema,
} from "@/lib/dto/asset-upload";
import { isDevelopmentMode } from "@/lib/helpers/env";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { assetService } from "@/services/domain/asset.service";

export const { PATCH } = createRouter({
  PATCH: {
    authenticatedOnly: isDevelopmentMode() ? false : true,
    handler: async (_, nextCtx, ctx) => {
      const { id } = await nextCtx.params;
      const parsedInput = validateInput(
        { uploadSessionId: id },
        commitUploadSessionInputSchema,
      );
      const result = await assetService.completeAssetUpload(ctx, parsedInput);
      const parsedResult = validateOutput(
        result,
        commitUploadSessionOutputSchema,
      );
      return NextResponse.json(parsedResult, { status: 200 });
    },
  },
});
