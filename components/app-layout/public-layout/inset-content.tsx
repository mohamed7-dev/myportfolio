"use client";
import type React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function InsetContent({ children }: { children: React.ReactNode }) {
  return (
    <SidebarInset
      className={cn("col-span-12 lg:col-span-9 lg:overflow-hidden lg:h-screen")}
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
