"use client";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePublicLayout } from "./public-layout-provider";

export function AvatarDisplayDialog() {
  const ctx = usePublicLayout("AvatarDisplayDialog");
  return (
    <Dialog
      open={ctx.isAvatarOpen}
      onOpenChange={(open) => !open && ctx.closeAvatar()}
    >
      <DialogContent showCloseButton={false} className="p-0">
        <div className="w-full h-112 relative">
          <Image
            src={ctx.profile.avatar?.sourceIdentifier ?? ""}
            alt={ctx.profile.displayName}
            className="size-full object-fill"
            sizes="28rem"
            fill
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
