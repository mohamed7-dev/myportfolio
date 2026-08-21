"use client";
import { TargetIcon, TrendingUpIcon } from "lucide-react";
import type React from "react";
import { usePublicLayout } from "@/components/app-layout/public-layout/public-layout-provider";
import { CardWrapper } from "@/components/shared/card-wrapper";
import { useLocalFormatter } from "@/hooks/use-locale-formatter";
import { useScopedI18n } from "@/i18n/client";
import { IconTile } from "../../../../components/shared/icon-tile";

export function Cards({ children }: { children: React.ReactNode }) {
  const ctx = usePublicLayout("Cards");
  const i18n = useScopedI18n("home.cards");
  const { formatNumber } = useLocalFormatter();
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
                {formatNumber(ctx.profile.yearsOfExperience)}{" "}
                {i18n("stats.years")}
              </strong>
            </p>
          </li>
          <li className="flex items-center justify-between pb-2 border-b border-border">
            <p className="w-full text-sm font-base flex items-center justify-between">
              <span>{i18n("stats.projectsShipped")}: </span>
              <strong className="text-sm font-base">
                {formatNumber(ctx.profile.projectsShipped)}
              </strong>
            </p>
          </li>
          <li className="flex items-center justify-between">
            <p className="w-full text-sm font-base flex items-center justify-between">
              <span>{i18n("stats.openSourceContributions")}: </span>
              <strong className="text-sm font-base">
                {formatNumber(ctx.profile.openSourceContributions)}
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
        <div
          dangerouslySetInnerHTML={{ __html: ctx.profile.currentFocus }}
          className="space-y-2"
        />
      </CardWrapper>
      {children}

      {/* <ProjectsCard>{children}</ProjectsCard> */}
      {/* <CareerCard /> */}
    </div>
  );
}
