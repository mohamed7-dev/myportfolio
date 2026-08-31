import { createRouter } from "@/api/common/create-router";
import {
  createAssetUploadInputSchema,
  createAssetUploadOutputSchema,
} from "@/lib/dto/asset-upload";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { isDevelopmentMode } from "@/lib/utils/is-env";
import { assetService } from "@/services/domain/asset.service";

export const { POST } = createRouter({
  POST: {
    authenticatedOnly: isDevelopmentMode() ? false : true,
    handler: async (req, ctx) => {
      const body = await req.json();
      const parsedInput = validateInput(body, createAssetUploadInputSchema);

      const result = await assetService.createUploadSession(ctx, parsedInput);

      const parsedResult = validateOutput(
        result,
        createAssetUploadOutputSchema,
      );

      return { body: parsedResult, init: { status: 201 } };
    },
  },
});
