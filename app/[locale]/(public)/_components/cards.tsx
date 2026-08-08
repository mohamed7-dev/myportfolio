"use client";
import {
  AwardIcon,
  BriefcaseIcon,
  Code2Icon,
  FolderIcon,
  MessageSquareIcon,
  QuoteIcon,
  UserRoundIcon,
} from "lucide-react";
import React from "react";
import { usePublicLayout } from "@/components/app-layout/public-layout/public-layout-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useI18n, useScopedI18n } from "@/i18n/client";
import { BentoLink } from "./bento-link";
import { IconTile } from "./icon-tile";

export function Cards({ children }: { children: React.ReactNode }) {
  const ctx = usePublicLayout("Cards");
  const i18n = useScopedI18n("cards");
  return (
    <React.Fragment>
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
        {/* <Card className="md:col-span-2 h-fit">
          <CardHeader>
            <CardTitle>{i18n("connect.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="icon">
              <MessageSquareIcon />
            </Button>
          </CardContent>
        </Card> */}
        <CareerCard />
      </div>
      {/* <p className="mb-6 text-foreground">{ctx.profile.subtitle}</p> */}
      {/* <div className="grid grid-cols-1 gap-2.5 md:grid-cols-4">
        <ProjectsCard />
        <AboutCard />
        <SkillsCard />
        <AchievementsCard />
        <CareerCard />
        <TestimonialsCard />
      </div> */}
    </React.Fragment>
  );
}

function ProjectsCard({ children }: { children: React.ReactNode }) {
  const i18n = useScopedI18n("cards.projects");

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

function AboutCard() {
  const i18n = useScopedI18n("cards.about");

  return (
    <BentoLink href="/about">
      <div className="flex min-h-77 flex-col items-center p-6 text-center">
        <IconTile>
          <UserRoundIcon className="size-6" />
        </IconTile>
        <h2 className="mt-4 text-base font-base">{i18n("title")}</h2>
        <p className="mt-2 text-xs text-foreground">{i18n("description")}</p>
        <div className="relative mt-auto h-[142px] w-[130px]">
          <span>about images</span>
          {/* {aboutImages.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt=""
              width={120}
              height={142}
              className="absolute bottom-0 left-1/2 h-[142px] w-[108px] origin-bottom rounded-2xl border border-border object-cover shadow-xl transition duration-500 group-hover:rotate-0"
              style={{
                transform: `translateX(-50%) rotate(${[-7, 6, -2, 10][index]}deg) translateX(${[-10, 8, 0, 14][index]}px)`,
                zIndex: index,
              }}
            />
          ))} */}
        </div>
      </div>
    </BentoLink>
  );
}

function SkillsCard() {
  const i18n = useScopedI18n("cards.skills");

  return (
    <BentoLink href="/about">
      <div className="flex min-h-[308px] flex-col items-center p-6 text-center">
        <IconTile>
          <Code2Icon className="size-6" />
        </IconTile>
        <h2 className="mt-4 text-base font-base">{i18n("title")}</h2>
        <p className="mt-2 max-w-[150px] text-xs leading-4 text-foreground">
          {i18n("description")}
        </p>
        <div className="mt-auto grid w-full grid-cols-2 gap-5 py-2">
          <span>skill images</span>
          {/* {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-secondary/70 px-3 text-sm"
            >
              {skill === "TypeScript" && (
                <span className="grid size-5 place-items-center rounded bg-blue-600 text-xs font-bold text-white">
                  TS
                </span>
              )}
              {skill}
            </span>
          ))} */}
        </div>
      </div>
    </BentoLink>
  );
}

function AchievementsCard() {
  const i18n = useScopedI18n("cards.achievements");

  return (
    <BentoLink href="/achievements">
      <div className="flex min-h-[308px] flex-col items-center p-6 text-center">
        <IconTile>
          <AwardIcon className="size-6" />
        </IconTile>
        <h2 className="mt-4 text-base font-base">{i18n("title")}</h2>
        <p className="mt-2 max-w-[170px] text-xs leading-4 text-foreground">
          {i18n("description")}
        </p>
        <div className="relative mt-auto h-[120px] w-full">
          <div className="absolute bottom-0 left-1/2 h-16 w-24 -translate-x-1/2 rounded-b-2xl rounded-t-md bg-yellow-400" />
          <span>images</span>
          {/* {achievements.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt=""
              width={110}
              height={74}
              className="absolute bottom-9 left-1/2 h-[58px] w-[96px] rounded border border-border object-cover shadow-xl transition duration-500 group-hover:-translate-y-2"
              style={{
                transform: `translateX(-50%) rotate(${[-10, 3, 12][index]}deg) translateX(${[-38, 0, 38][index]}px)`,
                zIndex: index + 1,
              }}
            />
          ))} */}
        </div>
      </div>
    </BentoLink>
  );
}

function CareerCard() {
  const i18n = useScopedI18n("cards.career");

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

function TestimonialsCard() {
  const i18n = useScopedI18n("cards.testimonials");

  // const loop = [...testimonials, ...testimonials];

  return (
    <BentoLink href="/contact" className="md:col-span-2">
      <div className="grid min-h-[308px] grid-cols-[150px_1fr] gap-4 p-6 max-sm:grid-cols-1">
        <div className="text-left max-sm:text-center">
          <IconTile>
            <QuoteIcon className="size-6" />
          </IconTile>
          <h2 className="mt-4 text-base font-base">{i18n("title")}</h2>
          <p className="mt-2 text-xs leading-4 text-foreground">
            {i18n("description")}
          </p>
        </div>
        <div className="relative h-[260px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
          <div className="animate-testimonials space-y-3">
            <span>images</span>
            {/* {loop.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="rounded-xl border border-border bg-secondary/70 p-3 text-left"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <Quote className="size-3 text-muted-foreground" />
                  <Image
                    src="/assets/aboutme/university_of_palestine.webp"
                    alt=""
                    width={22}
                    height={22}
                    className="rounded-full"
                  />
                </div>
                <p className="line-clamp-3 text-[11px] leading-4 text-muted-foreground">
                  {item.text}
                </p>
                <p className="mt-2 text-xs font-semibold">{item.name}</p>
                <p className="line-clamp-1 text-[10px] text-muted-foreground">
                  {item.org}
                </p>
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </BentoLink>
  );
}
