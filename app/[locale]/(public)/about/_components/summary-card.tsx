"use client";
import Image from "next/image";
import { usePublicLayout } from "@/components/app-layout/public-layout/public-layout-provider";

export function SummaryCard() {
  const ctx = usePublicLayout("SummaryCard");
  return (
    <div className="flex gap-4">
      <div className="w-full md:w-1/3 shrink-0 relative aspect-square rounded-base overflow-hidden border-2 border-border">
        {ctx.profile.avatar && (
          <Image
            src={ctx.profile.avatar?.previewIdentifier}
            alt={ctx.profile.displayName}
            fill
            className="w-full h-full object-cover grayscale-20 hover:grayscale-0 transition-all duration-500"
          />
        )}
      </div>
      <p>{ctx.profile.summary}</p>
    </div>
  );
}
