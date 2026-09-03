import React from "react";
import { wrapService } from "@/api/common/create-router";
import { AppImage } from "@/components/shared/app-image";
import { getCurrentLocale } from "@/i18n/server";
import { cacheKeys } from "@/lib/constants";
import { localizedCache } from "@/lib/helpers/localized-cache";
import { visitorService } from "@/services/domain/visitor.service";

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
    <React.Fragment>
      {featuredProjects.items.map((p, index) => (
        <div
          key={p.id}
          className="w-26 sm:w-42.5 absolute left-1/2 -translate-x-1/2 group-hover:-translate-y-2 duration-200 transition-transform bg-secondary-background p-1 rounded-base border-2 border-border shadow-lg"
          style={{
            top: `${index * 50}px`,
            zIndex: index,
            transitionDelay: `${index * 35}ms`,
          }}
        >
          <AppImage
            asset={p.featuredAsset}
            transform={{ preset: "thumb", mode: "resize" }}
            className="w-full aspect-video object-cover"
          />
        </div>
      ))}
    </React.Fragment>
  );
}
