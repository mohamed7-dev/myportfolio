import { type NextRequest, NextResponse } from "next/server";
import {
  asset,
  assetListInputSchema,
  assetListOutputSchema,
  createAssetInputSchema,
  deleteAssetsInputSchema,
  updateAssetInputSchema,
} from "@/lib/dto/asset";
import { paginatedListInputSchema } from "@/lib/dto/paginated-list";
import { authorize } from "@/lib/helpers/authorize";
import { validateInput } from "@/lib/helpers/validate-input";
import { validateOutput } from "@/lib/helpers/validate-output";
import { assetService } from "@/services/asset.service";

export async function POST(req: NextRequest) {
  await authorize();

  const body = await req.json();

  const parsedData = validateInput(body, createAssetInputSchema);

  const result = await assetService().createAsset(parsedData);

  const parsedResult = validateOutput(result, asset);

  return NextResponse.json(parsedResult);
}

export async function PUT(req: NextRequest) {
  await authorize();

  const body = await req.json();

  const parsedData = validateInput(body, updateAssetInputSchema);

  const result = await assetService().updateAsset(parsedData);

  const parsedResult = validateOutput(result, asset);

  return NextResponse.json(parsedResult);
}

export async function DELETE(req: NextRequest) {
  await authorize();

  const body = await req.json();

  const parsedBody = validateInput(body, deleteAssetsInputSchema);

  const result = await assetService().deleteAssets(parsedBody.input);

  return NextResponse.json(result);
}

export async function GET(req: NextRequest) {
  await authorize();

  const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsedSearchParams = validateInput(
    "filter" in searchParams && searchParams.filter
      ? { ...searchParams, filter: JSON.parse(searchParams.filter) }
      : searchParams,
    assetListInputSchema,
  );

  const result = await assetService().assets(parsedSearchParams);

  const parsedData = validateOutput(result, assetListOutputSchema);

  return NextResponse.json({
    items: parsedData.items,
    itemsCount: parsedData.itemsCount,
  });
}
