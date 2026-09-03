import { wrapService } from "@/api/common/create-router";
import { AppImage } from "@/components/shared/app-image";
import { getCurrentLocale } from "@/i18n/server";
import { cacheKeys } from "@/lib/constants";
import { localizedCache } from "@/lib/helpers/localized-cache";
import { visitorService } from "@/services/domain/visitor.service";

const getFeaturedCareers = localizedCache(
  async (locale) => {
    const getFeaturedCareers = wrapService({
      authenticatedOnly: false,
      handler: visitorService.getFeaturedCareers,
      ctx: { params: Promise.resolve({ locale }) },
    });
    const featuredCareers = await getFeaturedCareers();
    return featuredCareers;
  },
  cacheKeys.publicFeaturedCareers,
  { revalidate: 3600, tags: cacheKeys.publicFeaturedCareers },
);

export async function FeaturedCareer() {
  const featuredCareers = await getFeaturedCareers(await getCurrentLocale());

  return (
    <div className="mt-auto flex w-full items-center justify-center gap-5 overflow-hidden pb-4">
      {featuredCareers.items.map((item, index) => (
        <div
          key={item.id}
          className="grid size-14 shrink-0 place-items-center bg-secondary-background p-1 rounded-base border-2 border-border transition duration-500 group-hover:-translate-y-2"
          style={{ transitionDelay: `${index * 60}ms` }}
        >
          <AppImage
            asset={item.featuredAsset}
            transform={{ preset: "icon", mode: "resize" }}
            className="size-10 object-contain"
          />
        </div>
      ))}
    </div>
  );
}
