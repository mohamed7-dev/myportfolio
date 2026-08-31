import { createRouter } from "@/api/common/create-router";
import {
  downloadAssetInputSchema,
  downloadAssetOutputSchema,
} from "@/lib/dto/asset";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { assetService } from "@/services/domain/asset.service";

export const { GET } = createRouter({
  GET: {
    authenticatedOnly: true,
    handler: async (_req, ctx, _, nextCtx) => {
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

      return {
        body: parsedResult,
        init: {
          status: 200,
        },
      };
    },
  },
});
