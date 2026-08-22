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
        <AppImage
          key={p.id}
          asset={p.featuredAsset}
          transform={{ preset: "thumb", mode: "resize" }}
          className="rounded-base border-2 border-border object-cover transition duration-500 group-hover:-translate-y-2"
          style={{ transitionDelay: `${index * 35}ms` }}
        />
      ))}
    </React.Fragment>
  );
}
