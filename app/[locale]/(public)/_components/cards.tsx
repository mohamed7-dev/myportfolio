"use client";
import { BriefcaseIcon, FolderIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type React from "react";
import { usePublicLayout } from "@/components/app-layout/public-layout/public-layout-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BentoLink } from "./bento-link";
import { IconTile } from "./icon-tile";

export function Cards({ children }: { children: React.ReactNode }) {
  const ctx = usePublicLayout("Cards");
  const i18n = useTranslations("home.cards");
  return (
    <div className="grid grid-cols-1 gap-2.5 md:grid-cols-4 ">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{i18n("stats.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-2 capitalize">
            <li className="flex items-center justify-between pb-2 border-b border-border">
              <strong>{i18n("stats.experience")}: </strong>
              <strong className="text-primary text-base font-base">
                {ctx.profile.yearsOfExperience} {i18n("stats.years")}
              </strong>
            </li>
            <li className="flex items-center justify-between pb-2 border-b border-border">
              <strong>{i18n("stats.projectsShipped")}: </strong>
              <strong className="text-primary text-base font-base">
                {ctx.profile.projectsShipped}
              </strong>
            </li>
            <li className="flex items-center justify-between pb-2 border-b border-border">
              <strong>{i18n("stats.openSourceContributions")}: </strong>
              <strong className="text-primary text-base font-base">
                {ctx.profile.openSourceContributions}
              </strong>
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>{i18n("currentFocus.title")}</CardTitle>
        </CardHeader>
        <CardContent>{ctx.profile.currentFocus}</CardContent>
      </Card>
      <ProjectsCard>{children}</ProjectsCard>
      <CareerCard />
    </div>
  );
}

function ProjectsCard({ children }: { children: React.ReactNode }) {
  const i18n = useTranslations("home.cards.projects");

  return (
    <BentoLink href="/projects" className="md:col-span-2">
      <div className="relative min-h-77 p-6">
        <div className="relative z-10 max-w-42.5">
          <IconTile>
            <FolderIcon className="size-6" />
          </IconTile>
          <h2 className="mt-4 whitespace-pre-line text-lg font-heading leading-none tracking-wider uppercase">
            {i18n("title").replace(" ", "\n")}
          </h2>
          <p className="mt-2 text-xs font-base leading-4 text-foreground">
            {i18n("description")}
          </p>
        </div>
        <div className="absolute right-5 top-4 flex w-42.5 flex-col gap-5 sm:right-5">
          {children}
        </div>
      </div>
    </BentoLink>
  );
}

function CareerCard() {
  const i18n = useTranslations("home.cards.career");

  return (
    <BentoLink href="/career" className="md:col-span-2">
      <div className="flex min-h-[308px] flex-col items-center p-6 text-center">
        <IconTile>
          <BriefcaseIcon className="size-6" />
        </IconTile>
        <h2 className="mt-4 text-base font-base">{i18n("title")}</h2>
        <p className="mt-2 max-w-[170px] text-xs leading-4 text-foreground">
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
