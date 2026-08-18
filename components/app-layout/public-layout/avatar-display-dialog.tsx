"use client";
import { AppImage } from "@/components/shared/app-image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePublicLayout } from "./public-layout-provider";

export function AvatarDisplayDialog() {
  const ctx = usePublicLayout("AvatarDisplayDialog");

  if (!ctx.profile.avatar) return null;

  return (
    <Dialog
      open={ctx.isAvatarOpen}
      onOpenChange={(open) => !open && ctx.closeAvatar()}
    >
      <DialogContent
        showCloseButton={false}
        className="p-0 shadow-none border-0 max-w-[80vw] max-h-[80vh]"
      >
        {ctx.profile.avatar && (
          <AppImage
            asset={ctx.profile.avatar}
            transform={{
              preset: "full",
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
