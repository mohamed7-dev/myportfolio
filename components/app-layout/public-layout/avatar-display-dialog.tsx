"use client";
import { useState } from "react";
import { AppImage } from "@/components/shared/app-image";
import { DynamicLoader } from "@/components/shared/dynamic-loader";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePublicLayout } from "./public-layout-provider";

export function AvatarDisplayDialog() {
  const ctx = usePublicLayout("AvatarDisplayDialog");
  const [loadedImage, setLoadedImage] = useState<string | null>(null);
  const avatar = ctx.profile.avatar;

  if (!avatar) return null;

  const imageLoaded = loadedImage === avatar.previewIdentifier;

  return (
    <Dialog
      open={ctx.isAvatarOpen}
      onOpenChange={(open) => !open && ctx.closeAvatar()}
    >
      <DialogContent
        showCloseButton={false}
        className="shadow-none border-0 rounded-none p-2"
      >
        <div className="relative flex items-center justify-center">
          {!imageLoaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
              <DynamicLoader />
            </div>
          )}
          <AppImage
            asset={avatar}
            transform={{
              preset: "full",
            }}
            loading="eager"
            onLoad={() => setLoadedImage(avatar.previewIdentifier)}
            onError={() => setLoadedImage(avatar.previewIdentifier)}
            className={`size-full bg-red-500 object-contain transition-opacity ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
