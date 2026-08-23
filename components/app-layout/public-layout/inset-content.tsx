"use client";
import type React from "react";
import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function InsetContent({ children }: { children: React.ReactNode }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarInset
      className={cn(
        "col-span-12 overflow-hidden h-screen",
        !isMobile && "col-span-9",
      )}
    >
      <div
        id="main-content"
        className="w-full h-full transition-all duration-300 px-0 overflow-y-auto lg:px-8 py-4"
      >
        {children}
      </div>
    </SidebarInset>
  );
}
