import { TargetIcon, TrendingUpIcon } from "lucide-react";
import type React from "react";
import { CardWrapper } from "@/components/shared/card-wrapper";
import { IconTile } from "@/components/shared/icon-tile";
import { RichTextDisplay } from "@/components/shared/rich-text-editor/rich-text-display";
import { getCurrentLocale, getScopedI18n } from "@/i18n/server";
import type { GetSuperAdminProfileOutputSchema } from "@/lib/dto/visitor";
import { formatNumber } from "@/lib/helpers/locale-utils";

export async function Cards({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: GetSuperAdminProfileOutputSchema;
}) {
  const i18n = await getScopedI18n("home.cards");
  const currentLocale = await getCurrentLocale();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 ">
      <CardWrapper
        cardTitle={
          <span className="group flex items-center gap-2">
            <IconTile>
              <TrendingUpIcon />
            </IconTile>
            {i18n("stats.title")}
          </span>
        }
        className="md:col-span-2"
      >
        <ul className="flex flex-col gap-2 capitalize">
          <li className="flex items-center justify-between pb-2 border-b border-border">
            <p className="w-full text-sm font-base flex items-center justify-between">
              <span>{i18n("stats.experience")}:</span>
              <strong className="text-sm font-base">
                {formatNumber(profile.yearsOfExperience, currentLocale)}{" "}
                {i18n("stats.years")}
              </strong>
            </p>
          </li>
          <li className="flex items-center justify-between pb-2 border-b border-border">
            <p className="w-full text-sm font-base flex items-center justify-between">
              <span>{i18n("stats.projectsShipped")}: </span>
              <strong className="text-sm font-base">
                {formatNumber(profile.projectsShipped, currentLocale)}
              </strong>
            </p>
          </li>
          <li className="flex items-center justify-between">
            <p className="w-full text-sm font-base flex items-center justify-between">
              <span>{i18n("stats.openSourceContributions")}: </span>
              <strong className="text-sm font-base">
                {formatNumber(profile.openSourceContributions, currentLocale)}
              </strong>
            </p>
          </li>
        </ul>
      </CardWrapper>
      <CardWrapper
        className="md:col-span-2"
        cardTitle={
          <span className="group flex items-center gap-2">
            <IconTile>
              <TargetIcon />
            </IconTile>
            {i18n("currentFocus.title")}
          </span>
        }
      >
        <RichTextDisplay html={profile.currentFocus} />
      </CardWrapper>
      {children}
    </div>
  );
}
