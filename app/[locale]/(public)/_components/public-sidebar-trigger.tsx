"use client";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function PublicSidebarTrigger() {
  const { isMobile } = useSidebar();
  return <SidebarTrigger className={cn("flex", !isMobile && "hidden")} />;
}
