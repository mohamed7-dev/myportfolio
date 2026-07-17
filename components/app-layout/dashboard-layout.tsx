"use client";
import type React from "react";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardToolbar } from "./dashboard-toolbar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardToolbar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
