"use client";
import { usePublicLayout } from "@/components/app-layout/public-layout/public-layout-provider";
import { AppImage } from "@/components/shared/app-image";
import { RichTextDisplay } from "@/components/shared/rich-text-editor/rich-text-display";

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
      <RichTextDisplay html={ctx.profile.summary} className="col-span-2" />
    </div>
  );
}
