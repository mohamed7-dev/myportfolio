import { createHash } from "node:crypto";
import { openAsBlob } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import mime from "mime-types";
import { AssetUploader } from "@/lib/upload/asset-uploader";
import { seedFile } from "@/lib/upload/upload";

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
  assetId: string;
  // key: string;
  // url: string;
  // name: string;
  // size: number;
  // mimetype: string;
  // type: ObjectStorageResourceType;
  // width: number | null;
  // height: number | null;
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
// Upload And Asset Creation
// -----------------------------------------------------------------------------

async function getOrUploadFile(
  filePath: string,
  featuredFile: { blob: Blob; name: string },
  cache: AssetCache,
): Promise<UploadedFile> {
  const sourceFilePath = filePath;
  const file = await createFileFromDisk(sourceFilePath);
  const previewFile = file.blob.type.startsWith("video") ? featuredFile : file;

  const buffer = await readFile(filePath);

  const hash = createHash("sha256").update(buffer).digest("hex");
  const cacheKey = getCacheKey(filePath);
  const cached = cache[cacheKey];

  if (cached?.hash === hash) {
    return cached;
  }

  const uploader = new AssetUploader();

  const result = await uploader.upload({
    source: { data: file.blob, name: file.name },
    preview: { data: previewFile.blob, name: previewFile.name },
    uploadHandler: seedFile,
  });

  const uploaded = { ...result, hash };

  cache[cacheKey] = uploaded;

  await writeCache(cache);

  return uploaded;
}

async function createFileFromDisk(filePath: string) {
  const mimeType = mime.lookup(filePath) || "application/octet-stream";

  const blob = await openAsBlob(filePath, {
    type: mimeType,
  });

  return {
    blob,
    name: path.basename(filePath),
  };
}

// -----------------------------------------------------------------------------
// Seed asset groups
// -----------------------------------------------------------------------------

async function seedAssetGroup(
  group: SeedAssetGroup,
  cache: AssetCache,
): Promise<SeededAssetGroup> {
  const featuredDefinition = group.assets.find((asset) => asset.isFeatured);

  if (!featuredDefinition) {
    throw new Error(`Asset group "${group.key}" must have a featured asset`);
  }

  const seededAssets: SeededAsset[] = [];

  const featuredFile = await createFileFromDisk(featuredDefinition.filePath);

  for (const asset of group.assets) {
    const uploaded = await getOrUploadFile(asset.filePath, featuredFile, cache);

    seededAssets.push({
      isFeatured: asset.isFeatured,
      id: uploaded.assetId,
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

export async function seedAllAssets(): Promise<SeededAssets> {
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
    const seeded = await seedAssetGroup(group, cache);
    result.profile.set(seeded.key, seeded);
  }

  for (const group of normalizedAssetGroups.projects) {
    const seeded = await seedAssetGroup(group, cache);
    result.projects.set(seeded.key, seeded);
  }

  for (const group of normalizedAssetGroups.skills) {
    const seeded = await seedAssetGroup(group, cache);
    result.skills.set(seeded.key, seeded);
  }

  for (const group of normalizedAssetGroups.contactMethods) {
    const seeded = await seedAssetGroup(group, cache);
    result.contactMethods.set(seeded.key, seeded);
  }

  for (const group of normalizedAssetGroups.careers) {
    const seeded = await seedAssetGroup(group, cache);
    result.careers.set(seeded.key, seeded);
  }

  for (const group of normalizedAssetGroups.education) {
    const seeded = await seedAssetGroup(group, cache);
    result.education.set(seeded.key, seeded);
  }

  for (const group of normalizedAssetGroups.achievements) {
    const seeded = await seedAssetGroup(group, cache);
    result.achievements.set(seeded.key, seeded);
  }

  return result;
}
