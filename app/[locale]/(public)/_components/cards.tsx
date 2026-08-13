"use client";
import {
  BriefcaseIcon,
  FolderIcon,
  TargetIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type React from "react";
import { usePublicLayout } from "@/components/app-layout/public-layout/public-layout-provider";
import { CardWrapper } from "@/components/shared/card-wrapper";
import { IconTile } from "../../../../components/shared/icon-tile";
import { BentoLink } from "./bento-link";

export function Cards({ children }: { children: React.ReactNode }) {
  const ctx = usePublicLayout("Cards");
  const i18n = useTranslations("home.cards");
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
                {ctx.profile.yearsOfExperience} {i18n("stats.years")}
              </strong>
            </p>
          </li>
          <li className="flex items-center justify-between pb-2 border-b border-border">
            <p className="w-full text-sm font-base flex items-center justify-between">
              <span>{i18n("stats.projectsShipped")}: </span>
              <strong className="text-sm font-base">
                {ctx.profile.projectsShipped}
              </strong>
            </p>
          </li>
          <li className="flex items-center justify-between">
            <p className="w-full text-sm font-base flex items-center justify-between">
              <span>{i18n("stats.openSourceContributions")}: </span>
              <strong className="text-sm font-base">
                {ctx.profile.openSourceContributions}
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

      <ProjectsCard>{children}</ProjectsCard>
      <CareerCard />
    </div>
  );
}

function ProjectsCard({ children }: { children: React.ReactNode }) {
  const i18n = useTranslations("home.cards.projects");

  return (
    <BentoLink href="/projects" className="md:col-span-2">
      <div className="min-h-77 flex">
        <div className="max-w-42.5 self-center">
          <IconTile>
            <FolderIcon className="size-6" />
          </IconTile>
          <h3 className="mt-4 whitespace-pre-line leading-none tracking-wider uppercase font-heading text-sm md:text-lg text-foreground">
            {i18n("title").replace(" ", "\n")}
          </h3>
          <p className="mt-2 text-xs font-base leading-4 text-foreground">
            {i18n("description")}
          </p>
        </div>
        <div className="flex w-42.5 flex-col gap-5 sm:right-5">{children}</div>
      </div>
    </BentoLink>
  );
}

function CareerCard() {
  const i18n = useTranslations("home.cards.career");

  return (
    <BentoLink href="/career" className="md:col-span-2">
      <div className="flex min-h-77 flex-col items-center p-6 text-center">
        <IconTile>
          <BriefcaseIcon className="size-6" />
        </IconTile>
        <h3 className="mt-4 whitespace-pre-line leading-none tracking-wider uppercase font-heading text-sm md:text-lg text-foreground">
          {i18n("title")}
        </h3>
        <p className="mt-2 max-w-42.5 text-xs leading-4 text-foreground">
          {i18n("description")}
        </p>
        <div className="mt-auto flex w-full items-center justify-center gap-5 overflow-hidden pb-4">
          {["H", "UP", "S4G"].map((item, index) => (
            <div
              key={item}
              className="grid size-14 shrink-0 place-items-center rounded-2xl border border-border bg-secondary text-sm font-semibold shadow-xl transition duration-500 group-hover:-translate-y-2"
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </BentoLink>
  );
}
