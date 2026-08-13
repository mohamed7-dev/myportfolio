import { StarIcon } from "lucide-react";
import { AppImage } from "@/components/shared/app-image";
import { CardWrapper } from "@/components/shared/card-wrapper";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import type { GetPublicProjectsOutputSchema } from "@/lib/dto/visitor";

export function ProjectCard({
  project,
}: {
  project: GetPublicProjectsOutputSchema["items"][number];
}) {
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
              Featured
            </Badge>
          )}

          <AppImage
            asset={project.featuredAsset}
            transform={{ preset: "medium", mode: "resize" }}
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
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
            <Badge variant={"neutral"}>Rust</Badge>
            <Badge variant={"neutral"}>Kafka</Badge>
            <Badge variant={"neutral"}>gRPC</Badge>
          </div>
        </div>
      </CardWrapper>
    </Link>
  );
}
