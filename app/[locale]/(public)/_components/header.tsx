"use client";
import Image from "next/image";
import Link from "next/link";
import { usePublicLayout } from "@/components/app-layout/public-layout/public-layout-provider";
import { AppImage } from "@/components/shared/app-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useScopedI18n } from "@/i18n/client";
import type { Asset } from "@/lib/dto/asset";
import type { GetFeaturedSkillsOutputSchema } from "@/lib/dto/visitor";
import Logo from "../../../../public/logo.png";

export function HomePageHeader({
  skills,
  cover,
  personal,
}: {
  skills: GetFeaturedSkillsOutputSchema["items"];
  cover?: Asset;
  personal?: Asset;
}) {
  const i18n = useScopedI18n("home");
  const ctx = usePublicLayout("HomePageHeader");

  return (
    <div>
      <div className="overflow-hidden w-full bg-background relative h-60">
        <AppImage
          asset={cover}
          transform={{ preset: "full", mode: "resize" }}
          loading="eager"
          fetchPriority="high"
          className="size-full object-cover"
        />
      </div>
      <div className="px-0 sm:px-2 md:px-8 flex flex-col sm:flex-row sm:justify-between sm:items-end relative -mt-16 z-10">
        <div className="shrink-0 w-fit p-1 bg-secondary-background">
          {personal ? (
            <AppImage
              asset={personal}
              transform={{ preset: "thumb", mode: "resize" }}
            />
          ) : (
            <Image
              src={Logo}
              alt="logo"
              loading="eager"
              className="size-20 md:size-32 object-cover rounded-base grayscale-20 hover:grayscale-0 transition-all duration-500"
            />
          )}
        </div>
        <div className="mb-4 flex gap-3">
          <Button size="xs" asChild>
            <Link href={"/contact"}>{i18n("connect")}</Link>
          </Button>
          <Button size="xs" variant={"neutral"}>
            {i18n("cv")}
          </Button>
        </div>
      </div>
      <div className="px-0 sm:px-2 md:px-8 mt-4">
        <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-heading text-foreground">
          {ctx.profile.intro}
        </h1>
        <p className="text-sm sm:text-base font-base text-foreground/80 mt-1">
          {ctx.profile.jobTitle}
        </p>
        <p className="text-xs sm:text-sm font-base text-foreground mt-4 max-w-2xl">
          {ctx.profile.subHeading}
        </p>
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {skills?.map((skill) => (
            <Badge variant="neutral" key={skill.id}>
              {skill.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
