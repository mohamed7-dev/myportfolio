import { useLocale, useTranslations } from "next-intl";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { type I18nConfig, i18nConfig } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export function LanguageSwitcher({ mode }: { mode: "public" | "dashboard" }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const changeLocale = (newLocale: I18nConfig["locales"][number]["key"]) => {
    if (newLocale !== currentLocale) {
      router.replace(pathname, { locale: newLocale });
      router.refresh();
    }
  };
  const i18n = useTranslations("languages");
  if (mode === "dashboard") {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Content Language</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup
            value={currentLocale}
            onValueChange={(value) => {
              changeLocale(value as I18nConfig["locales"][number]["key"]);
            }}
          >
            {i18nConfig.locales.map((locale) => (
              <DropdownMenuRadioItem key={locale.key} value={locale.key}>
                {i18n(locale.key)}{" "}
                {locale.key === i18nConfig.defaultLocale ? "(Default)" : ""}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {i18nConfig.locales.map((item) => (
        <Button
          variant={currentLocale === item.key ? "default" : "neutral"}
          key={item.key}
          onClick={() =>
            changeLocale(item.key as I18nConfig["locales"][number]["key"])
          }
          className={cn("transition-all duration-200 capitalize")}
        >
          {i18n(item.key)}
        </Button>
      ))}
    </div>
  );
}
