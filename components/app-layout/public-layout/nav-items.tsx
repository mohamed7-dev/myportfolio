"use client";
import {
  AwardIcon,
  BookOpenIcon,
  BriefcaseIcon,
  FolderIcon,
  HomeIcon,
  UserRoundIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLocaleUtils } from "@/hooks/use-locale-utils";
import { useScopedI18n } from "@/i18n/client";
import { cn, isRouteActive } from "@/lib/utils";

const navLinks = [
  { href: (locale: string) => `/${locale}`, icon: HomeIcon, key: "home" },
  {
    href: (locale: string) => `/${locale}/about`,
    icon: UserRoundIcon,
    key: "about",
  },
  {
    href: (locale: string) => `/${locale}/projects`,
    icon: FolderIcon,
    key: "projects",
  },
  {
    href: (locale: string) => `/${locale}/career`,
    icon: BriefcaseIcon,
    key: "career",
  },
  {
    href: (locale: string) => `/${locale}/achievements`,
    icon: AwardIcon,
    key: "achievements",
  },
  {
    href: (locale: string) => `/${locale}/contact`,
    icon: BookOpenIcon,
    key: "contact",
  },
] as const;

export function NavItems() {
  const pathname = usePathname();
  const { urlSegmentLocale } = useLocaleUtils();
  const i18n = useScopedI18n("publicLayout.nav");

  const isActive = (href: string) => isRouteActive(pathname, href);
  const { setOpenMobile } = useSidebar();
  return (
    <React.Fragment>
      {navLinks.map((item) => {
        const active = isActive(item.href(urlSegmentLocale));
        return (
          <SidebarMenuItem key={item.href(urlSegmentLocale)}>
            <SidebarMenuButton onClick={() => setOpenMobile(false)} asChild>
              <Link
                href={item.href(urlSegmentLocale)}
                className={cn(
                  "group/nav flex items-center gap-4 rounded-lg px-4 py-2.5 text-base! font-heading! transition-all duration-300 hover:scale-[1.03]",
                  active && "relative hover:bg-secondary-background",
                )}
              >
                <item.icon className="size-5! transition-all duration-300 group-hover/nav:-rotate-12" />
                <span className="capitalize">{i18n(item.key)}</span>
                {active && (
                  <span
                    aria-hidden="true"
                    className="ml-auto size-3 rounded-base bg-primary border-2 border-border"
                  />
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </React.Fragment>
  );
}
