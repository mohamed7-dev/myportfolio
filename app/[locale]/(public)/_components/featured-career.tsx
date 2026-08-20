import { wrapService } from "@/api/common/create-router";
import { AppImage } from "@/components/shared/app-image";
import { visitorService } from "@/services/domain/visitor.service";

export async function FeaturedCareer() {
  const getFeaturedCareers = wrapService({
    authenticatedOnly: false,
    handler: visitorService.getFeaturedCareers,
  });
  const featuredCareers = await getFeaturedCareers();

  return (
    <div className="mt-auto flex w-full items-center justify-center gap-5 overflow-hidden pb-4">
      {featuredCareers.items.map((item, index) => (
        <div
          key={item.id}
          className="grid size-14 shrink-0 place-items-center rounded-base border-2 border-border transition duration-500 group-hover:-translate-y-2"
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
