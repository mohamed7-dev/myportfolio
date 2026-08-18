import { StarIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { AppImage } from "@/components/shared/app-image";
import { CardWrapper } from "@/components/shared/card-wrapper";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import type { GetPublicProjectsOutputSchema } from "@/lib/dto/visitor";

export async function ProjectCard({
  project,
}: {
  project: GetPublicProjectsOutputSchema["items"][number];
}) {
  const i18n = await getTranslations();
  return (
    <Link href={`/projects/${project.slug}`}>
      <CardWrapper interactive={true} className="p-0">
        <div className="h-60 w-full overflow-hidden relative">
          {project.featured && (
            <Badge
              variant={"neutral"}
              className="absolute top-4 left-4 z-10 backdrop-blur-md"
            >
              <StarIcon className="stroke-primary fill-primary" />
              <span>{i18n("featured")}</span>
            </Badge>
          )}

          <AppImage
            asset={project.featuredAsset}
            transform={{ preset: "medium", mode: "resize" }}
            className="size-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
        <div className="p-6 md:p-8 relative z-10">
          <h3 className="font-heading text-sm md:text-lg text-foreground mb-2">
            {project.name}
          </h3>
          <p className="font-base text-sm text-foreground/80 mb-6 line-clamp-2">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <Badge key={skill.id} variant={"neutral"}>
                {skill.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardWrapper>
    </Link>
  );
}
