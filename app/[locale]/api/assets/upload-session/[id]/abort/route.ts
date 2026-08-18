import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
import { abortUploadSessionInputSchema } from "@/lib/dto/asset-upload";
import { validateInput } from "@/lib/helpers/validate-input";
import { assetService } from "@/services/domain/asset.service";

export const { POST } = createRouter({
  POST: {
    authenticatedOnly: true,
    handler: async (_, nextCtx, ctx) => {
      const { id } = await nextCtx.params;
      const parsedInput = validateInput(
        { uploadSessionId: id },
        abortUploadSessionInputSchema,
      );
      try {
        await assetService.abortUpload(ctx, parsedInput);
        return NextResponse.json(null, { status: 204 });
      } catch (error) {
        console.log(error);
        return NextResponse.json(error);
      }
    },
  },
});
