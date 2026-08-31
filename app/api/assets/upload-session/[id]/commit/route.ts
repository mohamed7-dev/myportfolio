import { createRouter } from "@/api/common/create-router";
import {
  commitUploadSessionInputSchema,
  commitUploadSessionOutputSchema,
} from "@/lib/dto/asset-upload";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { isDevelopmentMode } from "@/lib/utils/is-env";
import { assetService } from "@/services/domain/asset.service";

export const { PATCH } = createRouter({
  PATCH: {
    authenticatedOnly: isDevelopmentMode() ? false : true,
    handler: async (_req, ctx, _headers, nextCtx) => {
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
      return { body: parsedResult, init: { status: 200 } };
    },
  },
});
