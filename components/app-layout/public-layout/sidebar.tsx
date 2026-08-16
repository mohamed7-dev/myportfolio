"use client";
import {
  AwardIcon,
  BadgeCheckIcon,
  BookOpenIcon,
  BriefcaseIcon,
  FolderIcon,
  HomeIcon,
  UserRoundIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { AppImage } from "@/components/shared/app-image";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useLocalFormatter } from "@/hooks/use-locale-formatter";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { AccentSwitcher } from "../accent-switcher";
import { LanguageSwitcher } from "../language-switcher";
import { usePublicLayout } from "./public-layout-provider";

const navLinks = [
  { href: "/", icon: HomeIcon, key: "home" },
  { href: "/about", icon: UserRoundIcon, key: "about" },
  { href: "/career", icon: BriefcaseIcon, key: "career" },
  { href: "/projects", icon: FolderIcon, key: "projects" },
  { href: "/achievements", icon: AwardIcon, key: "achievements" },
  { href: "/contact", icon: BookOpenIcon, key: "contact" },
] as const;

export function PublicSidebar() {
  const ctx = usePublicLayout("Sidebar");
  const i18n = useTranslations("publicLayout");
  const { formatNumber } = useLocalFormatter();
  const { isMobile } = useSidebar();

  return (
    <header className={cn(!isMobile && "relative col-span-3 mx-auto")}>
      <Sidebar
        collapsible={"offcanvas"}
        variant="sidebar"
        className="h-auto my-8 absolute border-none"
        innerSidebarClassName="bg-transparent"
      >
        <SidebarHeader className="py-4">
          <Identity />
        </SidebarHeader>
        <SidebarContent className="py-4">
          <nav className="flex flex-col gap-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-4 rounded-lg px-4 py-2.5 font-base transition-all duration-300 hover:scale-[1.03]"
              >
                <item.icon className="size-5 transition-all duration-300 group-hover:-rotate-12" />
                <span className="capitalize">{i18n(`nav.${item.key}`)}</span>
              </Link>
            ))}
          </nav>
        </SidebarContent>
        <SidebarFooter className="py-4 flex flex-col items-center gap-4">
          <AccentSwitcher mode="public" />
          <div className="text-center font-base">
            <p>
              © {formatNumber(new Date().getFullYear(), { useGrouping: false })}
            </p>
            <p className="capitalize">
              {ctx.profile.displayName} {i18n("copyright")}
            </p>
          </div>
        </SidebarFooter>
      </Sidebar>
    </header>
  );
}

function Identity() {
  const ctx = usePublicLayout("Identity");
  return (
    <div className="flex flex-col items-center">
      <ProfilePhoto />
      <Link
        href="/"
        className="mt-5 flex items-center gap-2 text-xl font-heading"
      >
        {ctx.profile.displayName}
        <BadgeCheckIcon className="size-4 text-primary" />
      </Link>
      <p className="mt-1 text-sm text-foreground font-base" dir="ltr">
        {ctx.profile.handle}
      </p>
      <div className="mt-6 flex flex-col items-center gap-4">
        <LanguageSwitcher mode="public" />
      </div>
    </div>
  );
}

function ProfilePhoto() {
  const ctx = usePublicLayout("ProfilePhoto");
  return (
    <Button
      type="button"
      variant={"default"}
      size={"icon-lg"}
      onClick={ctx.openAvatar}
      aria-label="View profile photo"
      className="rounded-base relative w-fit h-fit"
    >
      <AppImage
        asset={ctx.profile.avatar ?? undefined}
        transform={{ preset: "thumb", mode: "resize" }}
        className="rounded-base object-cover transition duration-500 hover:scale-105"
      />
    </Button>
  );
}
