import { redirect } from "next/navigation";
import type React from "react";
import { DashboardLayout as DashboardLayoutImpl } from "@/components/app-layout/dashboard-layout";
import { requestContextService } from "@/services/helpers/request-context.service";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestContext = await requestContextService.create();

  if (!requestContext.isAuthenticated) {
    redirect("/login");
  }

  return <DashboardLayoutImpl>{children} </DashboardLayoutImpl>;
}
