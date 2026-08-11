"use client";
import Image from "next/image";
import { usePublicLayout } from "@/components/app-layout/public-layout/public-layout-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function HomePageHeader({ children }: { children: React.ReactNode }) {
  const ctx = usePublicLayout("HomePageHeader");
  const filteredAssets = ctx.profile.assets?.filter(
    (asset) => asset.asset.id !== ctx.profile.avatar?.id,
  );

  const randomCover = filteredAssets?.length
    ? filteredAssets[Math.floor(Math.random())]
    : undefined;

  return (
    <Card>
      <CardContent>
        <div
          className="h-48 w-full bg-surface-variant relative"
          data-alt="A striking abstract architectural background with subtle glowing geometric lines, dark modern light-mode aesthetic, deep charcoal base with soft, diffused white lighting accents, perfect for a high-end technical portfolio cover."
          style={{
            backgroundImage: `url('${randomCover?.asset.previewIdentifier}')`,
          }}
        ></div>
        <div className="px-8 flex justify-between items-end relative -mt-16 z-10">
          <div className="p-1 bg-secondary-background rounded-full">
            {ctx.profile.avatar && (
              <Image
                src={ctx.profile.avatar?.previewIdentifier}
                alt={ctx.profile.displayName}
                width={ctx.profile.avatar.width}
                height={ctx.profile.avatar.height}
                className="size-32 rounded-full object-cover grayscale-20 hover:grayscale-0 transition-all duration-500"
              />
            )}
          </div>
          <div className="mb-4 flex gap-3">
            <Button>Connect</Button>
            <Button variant={"neutral"}>Message</Button>
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
      </CardContent>
    </Card>
  );
}
