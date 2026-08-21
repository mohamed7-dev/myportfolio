import { type NextRequest, NextResponse } from "next/server";
import {
  fromObjectKey,
  type LocalObjectStorage,
} from "@/lib/config/local-object-storage.strategy";
import {
  type ObjectLocation,
  ObjectStorageResourceType,
} from "@/lib/config/object-storage-strategy.interface";
import { serverConfig } from "@/lib/config/server-config";

export const runtime = "nodejs";

// NOTE: Dev Only Route

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  const key = formData.get("key");
  const contentType = formData.get("contentType");
  const resourceType = formData.get("resourceType");

  if (!(file instanceof File) || typeof key !== "string") {
    return NextResponse.json(
      { error: "file and key are required" },
      { status: 400 },
    );
  }

  let location: ObjectLocation;
  try {
    location = fromObjectKey(key);
  } catch {
    return NextResponse.json({ error: "invalid key" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await (
      serverConfig.asset.objectStorageStrategy as LocalObjectStorage
    ).writeObject(
      location,
      buffer,
      typeof contentType === "string" ? contentType : file.type,
      (resourceType as ObjectStorageResourceType) ??
        ObjectStorageResourceType.raw,
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, key }, { status: 200 });
}
