"use client";
import { useTranslations } from "next-intl";
import { AppImage } from "@/components/shared/app-image";
import { CardWrapper } from "@/components/shared/card-wrapper";
import { IconTile } from "@/components/shared/icon-tile";
import { Badge } from "@/components/ui/badge";
import { useLocalFormatter } from "@/hooks/use-locale-formatter";
import type { GetPublicEducationOutputSchema } from "@/lib/dto/visitor";

export function EducationCard({
  educationItem,
}: {
  educationItem: GetPublicEducationOutputSchema["items"][number];
}) {
  const { formatDate } = useLocalFormatter();
  const i18n = useTranslations();

  return (
    <CardWrapper>
      <div className="flex items-center justify-between">
        <div className="group flex items-center gap-4">
          <IconTile className="border-2 border-border rounded-base">
            <AppImage
              asset={educationItem.featuredAsset}
              transform={{ preset: "icon", mode: "resize" }}
              className="size-14 object-contain rounded-base"
            />
          </IconTile>
          <div>
            <h2 className="font-heading text-sm md:text-lg text-foreground capitalize">
              {educationItem.degree}
            </h2>
            <h3>@{educationItem.school}</h3>
          </div>
        </div>
        <div className="space-y-2">
          <Badge>
            {formatDate(educationItem.startDate, { dateStyle: "long" })}
            {" - "}
            {!educationItem.isPresent && educationItem.endDate
              ? formatDate(educationItem.endDate, { dateStyle: "long" })
              : i18n("present")}
          </Badge>
        </div>
      </div>
    </CardWrapper>
  );
}
