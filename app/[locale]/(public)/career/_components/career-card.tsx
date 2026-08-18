"use client";
import {
  BrainCircuitIcon,
  Heading4Icon,
  MapPinIcon,
  ZapIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { AppImage } from "@/components/shared/app-image";
import { IconTile } from "@/components/shared/icon-tile";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLocalFormatter } from "@/hooks/use-locale-formatter";
import { CareerMode, CareerType } from "@/lib/dto/career";
import type { GetPublicCareerOutputSchema } from "@/lib/dto/visitor";

export function CareerCard({
  careerItem,
}: {
  careerItem: GetPublicCareerOutputSchema["items"][number];
}) {
  const { formatDate } = useLocalFormatter();
  const i18n = useTranslations();

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
      <div className="flex items-center justify-between">
        <div className="group flex items-center gap-4">
          <IconTile className="border-2 border-border rounded-base">
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
        <div className="space-y-2">
          <Badge>
            {formatDate(careerItem.startDate, { dateStyle: "long" })}
            {" - "}
            {!careerItem.isPresent && careerItem.endDate
              ? formatDate(careerItem.endDate, { dateStyle: "long" })
              : i18n("present")}
          </Badge>
          <p className="flex items-center gap-1 capitalize">
            <MapPinIcon className="size-3.5" />
            <strong>{careerItem.location}</strong>
            <span className="capitalize">
              ({resolveCareerType(careerItem.type)})
            </span>
            <span className="capitalize">
              ({resolveCareerMode(careerItem.mode)})
            </span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-2">
        <section className="space-y-2">
          <h4 className="group font-base flex items-center gap-2">
            <IconTile className="size-6">
              <ZapIcon className="size-4" />
            </IconTile>
            {i18n("career.careerCard.impact")}
          </h4>
          <div
            dangerouslySetInnerHTML={{ __html: careerItem.impact }}
            className="[&>ul]:flex [&>ul]:flex-col [&>ul]:gap-4 [&>ul>li]:bg-background [&>ul>li]:p-2 [&>ul>li]:rounded-base [&>ul>li>p]:flex [&>ul>li>p]:flex-col [&>ul>li>p]:gap-2 [&>ul>li>p]:text-sm [&>ul>li>p]:font-base [&>ul>li>p>strong]:font-heading"
          />
        </section>
        <Separator orientation="vertical" />
        <section className="space-y-2">
          <h4 className="group font-base flex items-center gap-2">
            <IconTile className="size-6">
              <BrainCircuitIcon className="size-4" />
            </IconTile>
            {i18n("career.careerCard.learned")}
          </h4>
          <div
            dangerouslySetInnerHTML={{ __html: careerItem.learned }}
            className="[&>ul]:flex [&>ul]:flex-col [&>ul]:gap-4 [&>ul>li]:bg-background [&>ul>li]:p-2 [&>ul>li]:rounded-base [&>ul>li>p]:flex [&>ul>li>p]:flex-col [&>ul>li>p]:gap-2 [&>ul>li>p]:text-sm [&>ul>li>p]:font-base [&>ul>li>p>strong]:font-heading"
          />
        </section>
      </div>
    </article>
  );
}
