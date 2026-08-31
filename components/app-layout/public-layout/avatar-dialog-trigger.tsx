"use client";
import { AppImage } from "@/components/shared/app-image";
import { Button } from "@/components/ui/button";
import { usePublicLayout } from "./public-layout-provider";

export function AvatarDialogTrigger() {
  const ctx = usePublicLayout("AvatarDialogTrigger");

  return (
    <Button
      type="button"
      variant={"default"}
      size={"icon-lg"}
      onClick={ctx.openAvatar}
      aria-label="View profile photo"
      className="rounded-base size-auto"
    >
      <AppImage
        asset={ctx.profile.avatar ?? undefined}
        transform={{ preset: "thumb", mode: "resize" }}
        loading="eager"
        className="size-32 object-cover rounded-base transition duration-500 hover:scale-105"
      />
    </Button>
  );
}
