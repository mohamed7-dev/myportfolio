import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocalFormatter } from "@/hooks/use-locale-formatter";
import { useChangeLocale, useCurrentLocale } from "@/i18n/client";
import { sharedConfig } from "@/lib/config/shared-config";
import type { LanguageCode } from "@/lib/dto/language-code";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function LanguageSwitcher({ mode }: { mode: "public" | "dashboard" }) {
  const currentLocale = useCurrentLocale();
  const changeLocale = useChangeLocale({ preserveSearchParams: true });

  const { formatLanguageName } = useLocalFormatter();
  if (mode === "dashboard") {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Content Language</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup
            value={currentLocale}
            onValueChange={(value) => {
              changeLocale(value as LanguageCode);
            }}
          >
            {sharedConfig.i18n.locales.map((locale) => (
              <DropdownMenuRadioItem key={locale.key} value={locale.key}>
                {formatLanguageName(locale.key)}
                {locale.key === sharedConfig.i18n.defaultLocale
                  ? "(Default)"
                  : ""}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
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
          {formatLanguageName(item.key)}
        </Button>
      ))}
    </div>
  );
}
