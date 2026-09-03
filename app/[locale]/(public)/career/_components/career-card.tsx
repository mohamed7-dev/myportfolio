"use client";
import { BrainCircuitIcon, MapPinIcon, ZapIcon } from "lucide-react";
import { AppImage } from "@/components/shared/app-image";
import { IconTile } from "@/components/shared/icon-tile";
import { RichTextDisplay } from "@/components/shared/rich-text-editor/rich-text-display";
import { RichTextListDisplay } from "@/components/shared/rich-text-editor/rich-text-list-display";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocalFormatter } from "@/hooks/use-locale-formatter";
import { useI18n } from "@/i18n/client";
import { CareerMode, CareerType } from "@/lib/dto/career";
import type { GetPublicCareerOutputSchema } from "@/lib/dto/visitor";

export function CareerCard({
  careerItem,
}: {
  careerItem: GetPublicCareerOutputSchema["items"][number];
}) {
  const { formatDate } = useLocalFormatter();
  const i18n = useI18n();

  const resolveCareerType = (type: CareerType) => {
    switch (type) {
      case CareerType.FULL_TIME:
        return i18n("career.careerType.fullTime");
      case CareerType.PART_TIME:
        return i18n("career.careerType.partTime");
      case CareerType.FREELANCE:
        return i18n("career.careerType.freelance");
      case CareerType.INTERNSHIP:
        return i18n("career.careerType.internship");
      case CareerType.TRAINING:
        return i18n("career.careerType.training");
      case CareerType.CONTRACT:
        return i18n("career.careerType.contract");
      case CareerType.OPEN_SOURCE_CONTRIBUTION:
        return i18n("career.careerType.openSource");
    }
  };

  const resolveCareerMode = (type: CareerMode) => {
    switch (type) {
      case CareerMode.REMOTE:
        return i18n("career.careerMode.remote");
      case CareerMode.ON_SITE:
        return i18n("career.careerMode.onSite");
    }
  };

  return (
    <article className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="group flex items-center gap-4">
          <IconTile className="shrink-0 border-2 border-border rounded-base">
            <AppImage
              asset={careerItem.featuredAsset}
              transform={{ preset: "icon", mode: "resize" }}
              className="size-14 object-contain rounded-base"
            />
          </IconTile>
          <div>
            <h2 className="font-heading text-sm md:text-lg text-foreground capitalize">
              {careerItem.name}
            </h2>
            <h3>@{careerItem.organization}</h3>
          </div>
        </div>
        <div className="space-y-2 flex sm:block justify-between flex-wrap">
          <Badge>
            {formatDate(careerItem.startDate, { dateStyle: "long" })}
            {" - "}
            {!careerItem.isPresent && careerItem.endDate
              ? formatDate(careerItem.endDate, { dateStyle: "long" })
              : i18n("present")}
          </Badge>
          <p className="flex items-center sm:gap-1 capitalize">
            <MapPinIcon className="size-3.5" />
            <strong>{careerItem.location}</strong>
            <strong className="capitalize font-semibold">
              ({resolveCareerType(careerItem.type)})
            </strong>
            <strong className="capitalize font-semibold">
              ({resolveCareerMode(careerItem.mode)})
            </strong>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4">
        <section className="space-y-2">
          <h4 className="group font-base flex items-center gap-2">
            <IconTile className="size-6">
              <ZapIcon className="size-4" />
            </IconTile>
            {i18n("career.careerCard.impact")}
          </h4>
          <RichTextListDisplay html={careerItem.impact} />
        </section>
        <section className="space-y-2">
          <h4 className="group font-base flex items-center gap-2">
            <IconTile className="size-6">
              <BrainCircuitIcon className="size-4" />
            </IconTile>
            {i18n("career.careerCard.learned")}
          </h4>
          <RichTextListDisplay html={careerItem.learned} />
        </section>
      </div>
    </article>
  );
}
