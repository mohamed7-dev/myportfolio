import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
import {
  createAssetUploadInputSchema,
  createAssetUploadOutputSchema,
} from "@/lib/dto/asset-upload";
import { isDevelopmentMode } from "@/lib/helpers/env";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { assetService } from "@/services/domain/asset.service";

export const { POST } = createRouter({
  POST: {
    authenticatedOnly: isDevelopmentMode() ? false : true,
    handler: async (req, _, ctx) => {
      const body = await req.json();
      const parsedInput = validateInput(body, createAssetUploadInputSchema);

      const result = await assetService.createUploadSession(ctx, parsedInput);

      const parsedResult = validateOutput(
        result,
        createAssetUploadOutputSchema,
      );

      return NextResponse.json(parsedResult, { status: 201 });
    },
  },
});
