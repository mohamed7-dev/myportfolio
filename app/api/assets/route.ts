import { NextResponse } from "next/server";
import { createRouter } from "@/api/common/create-router";
import {
  asset,
  assetListInputSchema,
  assetListOutputSchema,
  createAssetInputSchema,
  deleteAssetsInputSchema,
  updateAssetInputSchema,
} from "@/lib/dto/asset";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { assetService } from "@/services/domain/asset.service";

export const { POST, PATCH, DELETE, GET } = createRouter({
  POST: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, createAssetInputSchema);

      const result = await assetService.create(ctx, parsedData);

      const parsedResult = validateOutput(result, asset);

      return NextResponse.json(parsedResult);
    },
  },
  PATCH: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedData = validateInput(body, updateAssetInputSchema);

      const result = await assetService.update(ctx, parsedData);

      const parsedResult = validateOutput(result, asset);

      return NextResponse.json(parsedResult);
    },
  },
  DELETE: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const body = await req.json();

      const parsedBody = validateInput(body, deleteAssetsInputSchema);

      const result = await assetService.delete(ctx, parsedBody);

      return NextResponse.json(result);
    },
  },
  GET: {
    authenticatedOnly: true,
    handler: async (req, _, ctx) => {
      const searchParams = Object.fromEntries(
        req.nextUrl.searchParams.entries(),
      );

      // TODO: we need to find a way to make zod parse the JSON input before validation
      const parsedSearchParams = validateInput(
        "filter" in searchParams && searchParams.filter
          ? { ...searchParams, filter: JSON.parse(searchParams.filter) }
          : searchParams,
        assetListInputSchema,
      );

      const result = await assetService.find(ctx, parsedSearchParams);

      const parsedData = validateOutput(result, assetListOutputSchema);

      return NextResponse.json({
        items: parsedData.items,
        itemsCount: parsedData.itemsCount,
      });
    },
  },
});
