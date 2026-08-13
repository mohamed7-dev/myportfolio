"use client";
import { useTranslations } from "next-intl";
import { usePublicLayout } from "@/components/app-layout/public-layout/public-layout-provider";
import { AppImage } from "@/components/shared/app-image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function HomePageHeader({ children }: { children: React.ReactNode }) {
  const i18n = useTranslations("home");
  const ctx = usePublicLayout("HomePageHeader");

  const filteredAssets = ctx.profile.assets?.filter(
    (asset) => asset.asset.id !== ctx.profile.avatar?.id,
  );

  const randomCover = filteredAssets?.length
    ? filteredAssets[Math.floor(Math.random())]
    : undefined;

  return (
    <div>
      <div className="h-48 w-full bg-background relative">
        <AppImage
          asset={randomCover?.asset}
          transform={{ preset: "medium", mode: "resize" }}
          className="object-cover size-full"
        />
      </div>
      <div className="px-8 flex justify-between items-end relative -mt-16 z-10">
        <div className="p-1 bg-secondary-background">
          {ctx.profile.avatar && (
            <AppImage
              asset={ctx.profile.avatar}
              transform={{ preset: "thumb", mode: "resize" }}
              className="rounded-base grayscale-20 hover:grayscale-0 transition-all duration-500"
            />
          )}
        </div>
        <div className="mb-4 flex gap-3">
          <Button asChild>
            <Link href={"/contact"}>{i18n("connect")}</Link>
          </Button>
          <Button variant={"neutral"}>{i18n("cv")}</Button>
        </div>
      </div>
      <div className="px-8 mt-4">
        <h1 className="text-2xl font-heading text-foreground">
          {ctx.profile.intro}
        </h1>
        <p className="text-base font-base text-foreground/80 mt-1">
          {ctx.profile.jobTitle}
        </p>
        <p className="text-sm font-base text-foreground mt-4 max-w-2xl">
          {ctx.profile.subHeading}
        </p>
        {children}
      </div>
    </div>
  );
}
