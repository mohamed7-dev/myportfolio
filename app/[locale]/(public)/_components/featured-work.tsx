import { wrapService } from "@/api/common/create-router";
import { getCurrentLocale } from "@/i18n/server";
import { cacheKeys } from "@/lib/constants";
import { localizedCache } from "@/lib/helpers/localized-cache";
import { visitorService } from "@/services/domain/visitor.service";
import { StackedImages } from "./stacked-images";

const getFeaturedProjects = localizedCache(
  async (locale) => {
    const getFeaturedProjects = wrapService({
      authenticatedOnly: false,
      handler: visitorService.getFeaturedProjects,
      ctx: { params: Promise.resolve({ locale }) },
    });
    const featuredProjects = await getFeaturedProjects();
    return featuredProjects;
  },
  cacheKeys.publicFeaturedProjects,
  { revalidate: 3600, tags: cacheKeys.publicFeaturedProjects },
);

export async function FeaturedWork() {
  const featuredProjects = await getFeaturedProjects(await getCurrentLocale());

  return (
    <StackedImages
      assets={featuredProjects?.items.map((item) => item.featuredAsset) ?? []}
    />
  );
}
