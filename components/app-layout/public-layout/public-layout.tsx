import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AvatarDisplayDialog } from "./avatar-display-dialog";
import { InsetContent } from "./inset-content";
import { PublicSidebar } from "./sidebar";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="relative mx-auto w-full max-w-7xl grid grid-cols-12 overflow-hidden h-screen">
        <PublicSidebar />
        <InsetContent>{children}</InsetContent>
      </div>
      <AvatarDisplayDialog />
    </SidebarProvider>
  );
}
