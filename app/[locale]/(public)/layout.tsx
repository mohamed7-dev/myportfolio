import type React from "react";
import { wrapService } from "@/api/common/create-router";
import { PublicLayout as PublicLayoutImpl } from "@/components/app-layout/public-layout/public-layout";
import { PublicLayoutProvider } from "@/components/app-layout/public-layout/public-layout-provider";
import { visitorService } from "@/services/domain/visitor.service";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const getSuperAdminProfile = wrapService({
    authenticatedOnly: false,
    handler: visitorService.getSuperAdminProfileInfo,
  });
  const profile = await getSuperAdminProfile();
  return (
    <PublicLayoutProvider profile={profile}>
      <div className="min-h-screen bg-background text-foreground">
        <PublicLayoutImpl>{children}</PublicLayoutImpl>
      </div>
    </PublicLayoutProvider>
  );
}
