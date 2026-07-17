import { redirect } from "next/navigation";
import type React from "react";
import { DashboardLayout as DashboardLayoutImpl } from "@/components/app-layout/dashboard-layout";
import { profileService } from "@/services/profile.service";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await profileService().getSession();

  if (!session.profile) {
    redirect("/login");
  }

  return <DashboardLayoutImpl>{children} </DashboardLayoutImpl>;
}
