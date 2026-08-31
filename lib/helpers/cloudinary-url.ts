type CloudinaryResourceType = "image" | "video";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export function getCloudinaryAssetUrl(
  publicId: string,
  resourceType: CloudinaryResourceType,
  transformations: string[] = [],
) {
  if (!cloudName) {
    return publicId;
  }

  const transformationPath = transformations.length
    ? `${transformations.join(",")}/`
    : "";

  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformationPath}${publicId}`;
}
