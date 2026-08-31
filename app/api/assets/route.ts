import { createRouter } from "@/api/common/create-router";
import {
  type AssetListInputSchema,
  assetListInputSchema,
  assetListOutputSchema,
  deleteAssetsInputSchema,
  deleteAssetsOutputSchema,
  updateAssetInputSchema,
  updateAssetOutputSchema,
} from "@/lib/dto/asset";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { assetService } from "@/services/domain/asset.service";

export const { PATCH, DELETE, GET } = createRouter({
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateAssetInputSchema);

      const result = await assetService.update(ctx, parsedData);

      const parsedResult = validateOutput(result, updateAssetOutputSchema);

      return { body: parsedResult, init: { status: 200 } };
    },
  },
  DELETE: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const body = await req.json();

      const parsedBody = validateInput(body, deleteAssetsInputSchema);

      const result = await assetService.delete(ctx, parsedBody);

      const parsedResult = validateOutput(result, deleteAssetsOutputSchema);

      return { body: parsedResult, init: { status: 200 } };
    },
  },
  GET: {
    authenticatedOnly: true,
    handler: async (req, ctx) => {
      const { searchParams } = new URL(req.url);

      const input = Object.fromEntries(
        searchParams.entries(),
      ) as AssetListInputSchema;
      const parsedInput = validateInput(
        {
          ...input,
          filter:
            input.filter && typeof input.filter === "object"
              ? JSON.parse(input.filter as string)
              : undefined,
        },
        assetListInputSchema,
      );
      const result = await assetService.find(ctx, parsedInput, { tags: true });
      const assets = validateOutput(result, assetListOutputSchema);
      return { body: assets, init: { status: 200 } };
    },
  },
});
