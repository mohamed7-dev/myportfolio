import fs from "node:fs";
import { Readable } from "node:stream";
import { type NextRequest, NextResponse } from "next/server";
import {
  fromObjectKey,
  resolveObjectPaths,
  verifySignedUrl,
} from "@/lib/config/local-object-storage.strategy";
import type { ObjectLocation } from "@/lib/config/object-storage-strategy.interface";
import { serverConfig } from "@/lib/config/server-config";

// NOTE: Dev Only Route

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const key = searchParams.get("key");
  const expires = searchParams.get("expires");
  const signature = searchParams.get("signature");

  if (!key || !expires || !signature) {
    return NextResponse.json({ error: "missing parameters" }, { status: 400 });
  }
  if (
    !verifySignedUrl(
      key,
      expires,
      signature,
      serverConfig.asset.localStorage.signingKey,
    )
  ) {
    return NextResponse.json(
      { error: "invalid or expired link" },
      { status: 403 },
    );
  }

  let location: ObjectLocation;
  try {
    location = fromObjectKey(key);
  } catch {
    return NextResponse.json({ error: "invalid key" }, { status: 400 });
  }

  const { filePath, metaPath } = resolveObjectPaths(
    serverConfig.asset.localStorage.baseDir,
    location,
  );

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const meta = fs.existsSync(metaPath)
    ? JSON.parse(fs.readFileSync(metaPath, "utf-8"))
    : { contentType: "application/octet-stream" };

  const stream = Readable.toWeb(
    fs.createReadStream(filePath),
  ) as ReadableStream;

  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": meta.contentType,
      "Content-Disposition": `inline; filename="${location.key}"`,
    },
  });
}
