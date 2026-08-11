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
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
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

export function Sidebar() {
  const ctx = usePublicLayout("Sidebar");
  const i18n = useTranslations("publicLayout");

  return (
    <header className="hidden lg:flex lg:w-1/5 lg:shrink-0 lg:flex-col lg:pt-4">
      <div className="z-10 flex h-full flex-col py-8">
        <Identity />
        <div className="my-5 border-t-2 border-border" />
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
        <div className="my-5 border-t-2 border-border" />
        <footer className="text-center text-sm font-base leading-6 text-foreground capitalize flex flex-col items-center gap-4">
          <AccentSwitcher mode="public" />
          <div>
            <p>© {new Date().getFullYear()}</p>
            <p>{i18n("copyright", { name: ctx.profile.displayName })}</p>
          </div>
        </footer>
      </div>
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

function ProfilePhoto({ size = 90 }: { size?: number }) {
  const ctx = usePublicLayout("ProfilePhoto");
  return (
    <Button
      type="button"
      variant={"default"}
      size={"icon-lg"}
      onClick={ctx.openAvatar}
      aria-label="View profile photo"
      className="rounded-full relative"
      style={{ width: size, height: size }}
    >
      {ctx.profile.avatar && (
        <Image
          src={ctx.profile.avatar?.sourceIdentifier ?? ""}
          alt={ctx.profile.displayName}
          sizes="90px"
          fill
          className="size-full rounded-full object-cover transition duration-500 hover:scale-105"
          priority
        />
      )}
    </Button>
  );
}
