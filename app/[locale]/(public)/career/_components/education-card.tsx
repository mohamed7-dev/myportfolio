"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { AppImage } from "@/components/shared/app-image";
import { CardWrapper } from "@/components/shared/card-wrapper";
import { IconTile } from "@/components/shared/icon-tile";
import { Badge } from "@/components/ui/badge";
import { useLocalFormatter } from "@/hooks/use-locale-formatter";
import { useI18n } from "@/i18n/client";
import type { GetPublicEducationOutputSchema } from "@/lib/dto/visitor";
import { cn } from "@/lib/utils";

export function EducationCard({
  educationItem,
}: {
  educationItem: GetPublicEducationOutputSchema["items"][number];
}) {
  const { formatDate } = useLocalFormatter();
  const i18n = useI18n();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();

  const isActive = searchParams.get("education") === educationItem.slug;

  useEffect(() => {
    if (isActive) {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isActive]);

  return (
    <CardWrapper
      className={cn(
        isActive &&
          "bg-primary shadow-none translate-x-box-shadow-x translate-y-box-shadow-y",
      )}
    >
      <div className="relative flex items-center justify-between" ref={cardRef}>
        <div className="absolute top-0 inset-e-0 space-y-2">
          <Badge variant={"neutral"}>
            {formatDate(educationItem.startDate, { dateStyle: "medium" })}
            {" - "}
            {!educationItem.isPresent && educationItem.endDate
              ? formatDate(educationItem.endDate, { dateStyle: "medium" })
              : i18n("present")}
          </Badge>
        </div>
        <div className="group flex items-center gap-4 mt-10">
          <IconTile className="shrink-0">
            <AppImage
              asset={educationItem.featuredAsset}
              transform={{ preset: "icon", mode: "resize" }}
              className="size-8 object-contain rounded-base"
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
