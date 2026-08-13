import React from "react";
import { wrapService } from "@/api/common/create-router";
import { AppImage } from "@/components/shared/app-image";
import { visitorService } from "@/services/domain/visitor.service";

export async function FeaturedWork() {
  const getFeaturedProjects = wrapService({
    authenticatedOnly: false,
    handler: visitorService.getFeaturedProjects,
  });
  const featuredProjects = await getFeaturedProjects();

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
