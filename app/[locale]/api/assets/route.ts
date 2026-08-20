import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
import {
  deleteAssetsInputSchema,
  deleteAssetsOutputSchema,
  updateAssetInputSchema,
  updateAssetOutputSchema,
} from "@/lib/dto/asset";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { assetService } from "@/services/domain/asset.service";

export const { PATCH, DELETE } = createRouter({
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateAssetInputSchema);

      const result = await assetService.update(ctx, parsedData);

      const parsedResult = validateOutput(result, updateAssetOutputSchema);

      return NextResponse.json(parsedResult, { status: 200 });
    },
  },
  DELETE: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedBody = validateInput(body, deleteAssetsInputSchema);

      const result = await assetService.delete(ctx, parsedBody);

      const parsedResult = validateOutput(result, deleteAssetsOutputSchema);

      return NextResponse.json(parsedResult, { status: 200 });
    },
  },
});
