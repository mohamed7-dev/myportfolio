import { BadgeCheckIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { getCurrentLocale, getScopedI18n } from "@/i18n/server";
import type { GetSuperAdminProfileOutputSchema } from "@/lib/dto/visitor";
import { formatNumber, isRtl } from "@/lib/helpers/locale-utils";
import { cn } from "@/lib/utils";
import { AccentSwitcher } from "../accent-switcher";
import { LanguageSwitcher } from "../language-switcher";
import { AvatarDialogTrigger } from "./avatar-dialog-trigger";
import { NavItems } from "./nav-items";

export async function PublicSidebar({
  profile,
}: {
  profile: GetSuperAdminProfileOutputSchema;
}) {
  const i18n = await getScopedI18n("publicLayout");
  const currentLocale = await getCurrentLocale();

  return (
    <header className={cn("lg:relative lg:col-span-3 lg:mx-auto")}>
      <Sidebar
        collapsible={"offcanvas"}
        variant="sidebar"
        className="h-auto my-8 absolute border-none"
        innerSidebarClassName="bg-transparent"
        side={isRtl(currentLocale) ? "right" : "left"}
      >
        <SidebarHeader className="py-4">
          <div className="flex flex-col items-center">
            <AvatarDialogTrigger />
            <Link
              href="/"
              className="mt-5 flex items-center gap-2 text-xl font-heading"
            >
              {profile.displayName}
              <BadgeCheckIcon className="size-4 text-primary" />
            </Link>
            <p className="mt-1 text-sm text-foreground font-base" dir="ltr">
              {profile.handle}
            </p>
            <div className="mt-6 flex flex-col items-center gap-4">
              <React.Suspense>
                <LanguageSwitcher mode="public" />
              </React.Suspense>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="py-4">
          <nav className="flex flex-col gap-y-1">
            <SidebarMenu className="gap-4 px-2">
              <NavItems />
            </SidebarMenu>
          </nav>
        </SidebarContent>
        <SidebarFooter className="py-4 flex flex-col items-center gap-4">
          <AccentSwitcher mode="public" />
          <div className="text-center text-foreground text-sm font-base">
            <p>
              ©{" "}
              {formatNumber(new Date().getFullYear(), currentLocale, {
                useGrouping: false,
              })}
            </p>
            <p className="capitalize">
              {profile.displayName} {i18n("copyright")}
            </p>
          </div>
        </SidebarFooter>
      </Sidebar>
    </header>
  );
}
