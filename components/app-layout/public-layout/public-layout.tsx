import dynamic from "next/dynamic";
import type React from "react";
import { DynamicLoader } from "@/components/shared/dynamic-loader";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { GetSuperAdminProfileOutputSchema } from "@/lib/dto/visitor";
import { InsetContent } from "./inset-content";
import { PublicSidebar } from "./sidebar";

const AvatarDisplayDialog = dynamic(
  () =>
    import("./avatar-display-dialog").then((mod) => mod.AvatarDisplayDialog),
  {
    loading: () => (
      <div className="fixed z-50 inset-0 bg-overlay/60 h-screen w-screen flex items-center justify-center text-primary">
        <DynamicLoader />
      </div>
    ),
  },
);

export function PublicLayout({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: GetSuperAdminProfileOutputSchema;
}) {
  return (
    <SidebarProvider>
      <div className="relative mx-auto w-full max-w-7xl grid grid-cols-12 overflow-hidden h-screen">
        <PublicSidebar profile={profile} />
        <InsetContent>{children}</InsetContent>
      </div>
      <AvatarDisplayDialog />
    </SidebarProvider>
  );
}
