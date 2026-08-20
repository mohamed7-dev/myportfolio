import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
import {
  downloadAssetInputSchema,
  downloadAssetOutputSchema,
} from "@/lib/dto/asset";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { assetService } from "@/services/domain/asset.service";

export const { POST, PATCH, DELETE, GET } = createRouter({
  POST: {
    authenticatedOnly: true,
    handler: async (_req, nextCtx, ctx) => {
      const { id } = await nextCtx.params;

      const parsedData = validateInput(
        { assetId: id },
        downloadAssetInputSchema,
      );

      const result = await assetService.getAssetDownloadUrl(ctx, parsedData);

      const parsedResult = validateOutput(
        { downloadUrl: result },
        downloadAssetOutputSchema,
      );

      return NextResponse.json(parsedResult);
    },
  },
});
