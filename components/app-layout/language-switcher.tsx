"use client";
import { LanguagesIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useLocalFormatter } from "@/hooks/use-locale-formatter";
import { useChangeLocale, useCurrentLocale } from "@/i18n/client";
import { sharedConfig } from "@/lib/config/shared-config";
import type { LanguageCode } from "@/lib/dto/language-code";
import { cn } from "@/lib/utils";
import { DynamicLoader } from "../shared/dynamic-loader";
import { Button } from "../ui/button";

const DashboardLanguageSwitcher = dynamic(
  () =>
    import("./dashboard-language-switcher").then(
      (mod) => mod.DashboardLanguageSwitcher,
    ),
  {
    loading: () => <DynamicLoader />,
  },
);

export function LanguageSwitcher({ mode }: { mode: "public" | "dashboard" }) {
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale({ preserveSearchParams: true });

  const { formatLanguageName } = useLocalFormatter();
  if (mode === "dashboard") {
    return (
      <DashboardLanguageSwitcher
        value={currentLocale as LanguageCode}
        onChange={changeLocale}
      />
    );
  }

  return (
    <div className="flex items-center flex-wrap gap-2">
      {sharedConfig.i18n.locales.map((item) => (
        <Button
          variant={currentLocale === item.key ? "default" : "neutral"}
          size={"sm"}
          key={item.key}
          onClick={() => changeLocale(item.key as LanguageCode)}
          className={cn("transition-all duration-200 capitalize")}
        >
          <LanguagesIcon /> {formatLanguageName(item.key)}
        </Button>
      ))}
    </div>
  );
}
