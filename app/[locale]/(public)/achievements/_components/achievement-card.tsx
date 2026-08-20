"use client";
import { AwardIcon, BriefcaseIcon, SchoolIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import React from "react";
import { CardWrapper } from "@/components/shared/card-wrapper";
import { IconTile } from "@/components/shared/icon-tile";
import { MediaGallery } from "@/components/shared/media-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocalFormatter } from "@/hooks/use-locale-formatter";
import { AchievementType } from "@/lib/dto/achievement";
import type { GetPublicAchievementsOutputSchema } from "@/lib/dto/visitor";

export function AchievementCard({
  achievement,
}: {
  achievement: GetPublicAchievementsOutputSchema["items"][number];
}) {
  const i18n = useTranslations("achievements");
  const { formatDate } = useLocalFormatter();
  const resolveCardTitle = React.useCallback(() => {
    switch (achievement.type) {
      case AchievementType.CERTIFICATE:
        return (
          <span className="group flex items-center gap-2">
            <IconTile>
              <AwardIcon className="size-6" />
            </IconTile>
            {i18n("types.certificate")}
          </span>
        );
      case AchievementType.COURSE:
        return (
          <span className="group flex items-center gap-2">
            <IconTile>
              <SchoolIcon className="size-6" />
            </IconTile>
            {i18n("types.course")}
          </span>
        );
      case AchievementType.INTERNSHIP:
        return (
          <span className="group flex items-center gap-2">
            <IconTile>
              <BriefcaseIcon className="size-6" />
            </IconTile>
            {i18n("types.internship")}
          </span>
        );
    }
  }, [achievement, i18n]);

  return (
    <CardWrapper cardTitle={resolveCardTitle()} interactive={true}>
      <div className="w-full overflow-hidden">
        <MediaGallery
          entityAssets={achievement.assets}
          staticImageProps={{
            transform: { preset: "thumb", mode: "resize" },
            className: "size-full object-cover",
          }}
        />
      </div>
      <div className="space-y-2 mt-4">
        <h4 className="capitalize text-sm font-heading">{achievement.name}</h4>
        {/* <Separator /> */}
        <div className="flex items-center gap-2">
          <Badge variant={"neutral"}>{achievement.organization}</Badge>
          <Badge variant={"neutral"}>
            <span>{i18n("issuedAt")}: </span>
            {formatDate(achievement.issueDate)}
          </Badge>
        </div>
        <Button className="mt-4 w-full" asChild>
          <Link href={achievement.credentialUrl} target="_blank">
            {i18n("verifyCredentialsLabel")}
          </Link>
        </Button>
      </div>
    </CardWrapper>
  );
}
