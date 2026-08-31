import { createRouter } from "@/api/common/create-router";
import { abortUploadSessionInputSchema } from "@/lib/dto/asset-upload";
import { validateInput } from "@/lib/helpers/validate-input";
import { isDevelopmentMode } from "@/lib/utils/is-env";
import { assetService } from "@/services/domain/asset.service";

export const { PATCH } = createRouter({
  PATCH: {
    authenticatedOnly: isDevelopmentMode() ? false : true,
    handler: async (_req, ctx, _headers, nextCtx) => {
      const { id } = await nextCtx.params;
      const parsedInput = validateInput(
        { uploadSessionId: id },
        abortUploadSessionInputSchema,
      );
      await assetService.abortUpload(ctx, parsedInput);
      return { body: null, init: { status: 200 } };
    },
  },
});
