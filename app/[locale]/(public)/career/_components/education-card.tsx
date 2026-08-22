"use client";
import { AppImage } from "@/components/shared/app-image";
import { CardWrapper } from "@/components/shared/card-wrapper";
import { IconTile } from "@/components/shared/icon-tile";
import { Badge } from "@/components/ui/badge";
import { useLocalFormatter } from "@/hooks/use-locale-formatter";
import { useI18n } from "@/i18n/client";
import type { GetPublicEducationOutputSchema } from "@/lib/dto/visitor";

export function EducationCard({
  educationItem,
}: {
  educationItem: GetPublicEducationOutputSchema["items"][number];
}) {
  const { formatDate } = useLocalFormatter();
  const i18n = useI18n();

  return (
    <CardWrapper>
      <div className="relative flex items-center justify-between">
        <div className="absolute top-0 inset-e-0 space-y-2">
          <Badge>
            {formatDate(educationItem.startDate, { dateStyle: "long" })}
            {" - "}
            {!educationItem.isPresent && educationItem.endDate
              ? formatDate(educationItem.endDate, { dateStyle: "long" })
              : i18n("present")}
          </Badge>
        </div>
        <div className="group flex items-center gap-4 mt-10">
          <IconTile className="shrink-0 border-2 border-border rounded-base">
            <AppImage
              asset={educationItem.featuredAsset}
              transform={{ preset: "icon", mode: "resize" }}
              className="size-20 object-contain rounded-base"
            />
          </IconTile>
          <div>
            <h2 className="font-heading text-sm md:text-lg text-foreground capitalize">
              {educationItem.degree}
            </h2>
            <h3>@{educationItem.school}</h3>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
