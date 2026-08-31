"use client";
import { usePublicLayout } from "@/components/app-layout/public-layout/public-layout-provider";
import { AppImage } from "@/components/shared/app-image";

export function SummaryCard() {
  const ctx = usePublicLayout("SummaryCard");
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="col-span-1 flex justify-center sm:flex-none h-fit shrink-0 relative rounded-base overflow-hidden border-2 border-border">
        <AppImage
          asset={ctx.profile.avatar ?? undefined}
          transform={{ preset: "small", mode: "resize" }}
          loading="eager"
          fetchPriority="high"
          className="w-full h-60 object-cover grayscale-20 hover:grayscale-0 transition-all duration-500"
        />
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: ctx.profile.summary }}
        className="col-span-2 [&>h3]:text-sm [&>h3]:md:text-base [&>h3]:md:font-heading [&>h3]:mb-4 [&>p]:text-foreground [&>p]:font-base [&>p]:leading-relaxed [&>p>strong]:mt-4"
        suppressHydrationWarning
      />
    </div>
  );
}
