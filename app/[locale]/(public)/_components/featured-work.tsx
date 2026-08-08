import Image from "next/image";
import React from "react";
import { wrapService } from "@/api/common/create-router";
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
        <Image
          key={p.id}
          src={p.featuredAsset.previewIdentifier}
          alt={p.name}
          width={170}
          height={96}
          className="h-21.5 rounded-base border border-border object-cover shadow-2xl transition duration-500 group-hover:-translate-y-2"
          style={{ transitionDelay: `${index * 35}ms` }}
        />
      ))}
    </React.Fragment>
  );
}
