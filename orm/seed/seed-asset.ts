import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { imageSize } from "image-size";
import { UTFile } from "uploadthing/server";
import type { RequestContext } from "@/api/request-context/request-context";
import { ObjectStorageResourceType } from "@/lib/config/object-storage-strategy.interface";
import { utapi } from "@/lib/helpers/ut-api";
import { assetService } from "@/services/domain/asset.service";

const CACHE_PATH = path.join(
  process.cwd(),
  ".dev",
  "seed",
  "uploaded-assets.json",
);

type AssetCache = Record<string, UploadedFile>;

async function readCache(): Promise<AssetCache> {
  try {
    const contents = await readFile(CACHE_PATH, "utf8");

    return JSON.parse(contents) as AssetCache;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return {};
    }

    throw error;
  }
}

async function writeCache(cache: AssetCache): Promise<void> {
  await mkdir(path.dirname(CACHE_PATH), {
    recursive: true,
  });

  await writeFile(CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
}

function getCacheKey(filePath: string): string {
  return path
    .relative(path.join(process.cwd(), "public"), filePath)
    .split(path.sep)
    .join("/");
}

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type SeedAssetDefinition = {
  path: string;
  isFeatured?: boolean;
};

type SeedAssetGroupDefinition = {
  key: string;
  assets: SeedAssetDefinition[];
};

type SeedAsset = {
  filePath: string;
  isFeatured: boolean;
};

type SeedAssetGroup = {
  key: string;
  assets: SeedAsset[];
};

type SeededAsset = {
  id: string;
  isFeatured: boolean;
};

export type SeededAssetGroup = {
  key: string;
  assets: SeededAsset[];
  featuredAsset: SeededAsset;
};

type SeededAssets = {
  profile: Map<string, SeededAssetGroup>;
  projects: Map<string, SeededAssetGroup>;
  skills: Map<string, SeededAssetGroup>;
  contactMethods: Map<string, SeededAssetGroup>;
  careers: Map<string, SeededAssetGroup>;
  education: Map<string, SeededAssetGroup>;
  achievements: Map<string, SeededAssetGroup>;
};

type UploadedFile = {
  key: string;
  url: string;
  name: string;
  size: number;
  mimetype: string;
  type: ObjectStorageResourceType;
  width: number | null;
  height: number | null;
  hash: string;
};

// -----------------------------------------------------------------------------
// Asset definitions
// -----------------------------------------------------------------------------

const assetGroups = {
  profile: [
    {
      key: "me",
      assets: [
        {
          path: "/dev-assets/profile/featured.png",
          isFeatured: true,
        },
        {
          path: "/dev-assets/profile/1.png",
        },
      ],
    },
  ],
  projects: [
    {
      key: "vidora",
      assets: [
        {
          path: "/dev-assets/projects/vidora/featured.png",
          isFeatured: true,
        },
        {
          path: "/dev-assets/projects/vidora/1.png",
        },
        {
          path: "/dev-assets/projects/vidora/2.png",
        },
        {
          path: "/dev-assets/projects/vidora/3.png",
        },
        {
          path: "/dev-assets/projects/vidora/4.png",
        },
        {
          path: "/dev-assets/projects/vidora/vidora-in-action.mp4",
        },
      ],
    },
    {
      key: "snippetly",
      assets: [
        {
          path: "/dev-assets/projects/snippetly/featured.png",
          isFeatured: true,
        },
        {
          path: "/dev-assets/projects/snippetly/1.png",
        },
        {
          path: "/dev-assets/projects/snippetly/2.png",
        },
        {
          path: "/dev-assets/projects/snippetly/3.png",
        },
        {
          path: "/dev-assets/projects/snippetly/4.png",
        },
      ],
    },
  ],

  skills: [
    {
      key: "reactjs",
      assets: [
        {
          path: "/dev-assets/skills/react.png",
          isFeatured: true,
        },
      ],
    },
    {
      key: "nodejs",
      assets: [
        {
          path: "/dev-assets/skills/node.png",
          isFeatured: true,
        },
      ],
    },
    {
      key: "figma",
      assets: [
        {
          path: "/dev-assets/skills/figma.png",
          isFeatured: true,
        },
      ],
    },
  ],

  contactMethods: [
    {
      key: "github",
      assets: [
        {
          path: "/dev-assets/contact-methods/github.png",
          isFeatured: true,
        },
      ],
    },
    {
      key: "linkedin",
      assets: [
        {
          path: "/dev-assets/contact-methods/linkedin.png",
          isFeatured: true,
        },
      ],
    },
    {
      key: "mail",
      assets: [
        {
          path: "/dev-assets/contact-methods/mail.png",
          isFeatured: true,
        },
      ],
    },
  ],

  careers: [
    {
      key: "company-1",
      assets: [
        {
          path: "/dev-assets/careers/company-logo.png",
          isFeatured: true,
        },
      ],
    },
  ],

  education: [
    {
      key: "university-1",
      assets: [
        {
          path: "/dev-assets/education/university-logo.png",
          isFeatured: true,
        },
      ],
    },
  ],

  achievements: [
    {
      key: "certificate-1",
      assets: [
        {
          path: "/dev-assets/achievements/certificate.jpg",
          isFeatured: true,
        },
      ],
    },
  ],
} satisfies Record<string, SeedAssetGroupDefinition[]>;

// -----------------------------------------------------------------------------
// Normalization
// -----------------------------------------------------------------------------

function normalizeAssetGroup(group: SeedAssetGroupDefinition): SeedAssetGroup {
  return {
    key: group.key,

    assets: group.assets.map((asset) => ({
      filePath: path.join(process.cwd(), "public", asset.path),
      isFeatured: asset.isFeatured ?? false,
    })),
  };
}

function normalizeAssetGroups(
  groups: SeedAssetGroupDefinition[],
): SeedAssetGroup[] {
  return groups.map(normalizeAssetGroup);
}

const normalizedAssetGroups = {
  profile: normalizeAssetGroups(assetGroups.profile),
  projects: normalizeAssetGroups(assetGroups.projects),
  skills: normalizeAssetGroups(assetGroups.skills),
  contactMethods: normalizeAssetGroups(assetGroups.contactMethods),
  careers: normalizeAssetGroups(assetGroups.careers),
  education: normalizeAssetGroups(assetGroups.education),
  achievements: normalizeAssetGroups(assetGroups.achievements),
};

// -----------------------------------------------------------------------------
// Upload
// -----------------------------------------------------------------------------

function getAssetType(mimetype: string): ObjectStorageResourceType {
  if (mimetype.startsWith("image/")) {
    return ObjectStorageResourceType.image;
  }

  if (mimetype.startsWith("video/")) {
    return ObjectStorageResourceType.video;
  }

  throw new Error(`Unsupported asset MIME type: ${mimetype}`);
}

async function uploadSeedFile(filePath: string): Promise<UploadedFile> {
  const buffer = await readFile(filePath);

  const hash = createHash("sha256").update(buffer).digest("hex");

  const filename = path.basename(filePath);

  const file = new UTFile([buffer], filename);

  const result = await utapi.uploadFiles(file);

  if (result.error) {
    throw new Error(`Failed to upload "${filePath}": ${result.error.message}`);
  }

  const type = getAssetType(file.type);

  let width: number | null = null;
  let height: number | null = null;

  if (type === ObjectStorageResourceType.image) {
    const dimensions = imageSize(buffer);

    width = dimensions.width ?? null;
    height = dimensions.height ?? null;
  }

  return {
    key: result.data.key,
    url: result.data.ufsUrl,
    name: result.data.name,
    size: result.data.size,
    mimetype: file.type,
    type,
    width,
    height,
    hash,
  };
}

async function getOrUploadFile(
  filePath: string,
  cache: AssetCache,
): Promise<UploadedFile> {
  const buffer = await readFile(filePath);

  const hash = createHash("sha256").update(buffer).digest("hex");

  const cacheKey = getCacheKey(filePath);
  const cached = cache[cacheKey];

  if (cached?.hash === hash) {
    return cached;
  }

  const uploaded = await uploadSeedFile(filePath);

  cache[cacheKey] = uploaded;

  await writeCache(cache);

  return uploaded;
}

// -----------------------------------------------------------------------------
// Asset entity creation
// -----------------------------------------------------------------------------

async function createAsset(
  ctx: RequestContext,
  source: UploadedFile,
  preview: UploadedFile,
) {
  const dimensions =
    source.type === ObjectStorageResourceType.video
      ? {
          width: preview.width,
          height: preview.height,
        }
      : {
          width: source.width,
          height: source.height,
        };

  const asset = await assetService.create(ctx, {
    sourceIdentifier: source.url,
    previewIdentifier: preview.url,

    sourceFilename: source.name,
    sourceFileMimetype: source.mimetype,
    sourceFileSize: source.size,

    width: dimensions.width ?? undefined,
    height: dimensions.height ?? undefined,

    type: source.type,
  });

  return asset;
}

// -----------------------------------------------------------------------------
// Seed asset groups
// -----------------------------------------------------------------------------

async function seedAssetGroup(
  ctx: RequestContext,
  group: SeedAssetGroup,
  cache: AssetCache,
): Promise<SeededAssetGroup> {
  const featuredDefinition = group.assets.find((asset) => asset.isFeatured);

  if (!featuredDefinition) {
    throw new Error(`Asset group "${group.key}" must have a featured asset`);
  }

  const uploadedAssets = new Map<string, UploadedFile>();

  for (const asset of group.assets) {
    const uploaded = await getOrUploadFile(asset.filePath, cache);

    uploadedAssets.set(asset.filePath, uploaded);
  }

  const featuredUpload = uploadedAssets.get(featuredDefinition.filePath);

  if (!featuredUpload) {
    throw new Error(`Featured asset for "${group.key}" was not uploaded`);
  }

  if (featuredUpload.type !== ObjectStorageResourceType.image) {
    throw new Error(`Featured asset for "${group.key}" must be an image`);
  }

  const seededAssets: SeededAsset[] = [];

  for (const asset of group.assets) {
    const uploaded = uploadedAssets.get(asset.filePath);

    if (!uploaded) {
      throw new Error(`Uploaded asset not found for "${asset.filePath}"`);
    }

    const preview =
      uploaded.type === ObjectStorageResourceType.video
        ? featuredUpload
        : uploaded;

    const entity = await createAsset(ctx, uploaded, preview);

    seededAssets.push({
      id: entity.id,
      isFeatured: asset.isFeatured,
    });
  }

  const featuredAsset = seededAssets.find((asset) => asset.isFeatured);

  if (!featuredAsset) {
    throw new Error(
      `Created assets for "${group.key}" do not contain a featured asset`,
    );
  }

  return {
    key: group.key,
    assets: seededAssets,
    featuredAsset,
  };
}

// -----------------------------------------------------------------------------
// Seed all assets first
// -----------------------------------------------------------------------------

export async function seedAllAssets(
  ctx: RequestContext,
): Promise<SeededAssets> {
  const cache = await readCache();

  const result: SeededAssets = {
    profile: new Map(),
    projects: new Map(),
    skills: new Map(),
    contactMethods: new Map(),
    careers: new Map(),
    education: new Map(),
    achievements: new Map(),
  };

  for (const group of normalizedAssetGroups.profile) {
    const seeded = await seedAssetGroup(ctx, group, cache);
    result.profile.set(seeded.key, seeded);
  }

  for (const group of normalizedAssetGroups.projects) {
    const seeded = await seedAssetGroup(ctx, group, cache);
    result.projects.set(seeded.key, seeded);
  }

  for (const group of normalizedAssetGroups.skills) {
    const seeded = await seedAssetGroup(ctx, group, cache);
    result.skills.set(seeded.key, seeded);
  }

  for (const group of normalizedAssetGroups.contactMethods) {
    const seeded = await seedAssetGroup(ctx, group, cache);
    result.contactMethods.set(seeded.key, seeded);
  }

  for (const group of normalizedAssetGroups.careers) {
    const seeded = await seedAssetGroup(ctx, group, cache);
    result.careers.set(seeded.key, seeded);
  }

  for (const group of normalizedAssetGroups.education) {
    const seeded = await seedAssetGroup(ctx, group, cache);
    result.education.set(seeded.key, seeded);
  }

  for (const group of normalizedAssetGroups.achievements) {
    const seeded = await seedAssetGroup(ctx, group, cache);
    result.achievements.set(seeded.key, seeded);
  }

  return result;
}
