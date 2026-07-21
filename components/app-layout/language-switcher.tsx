import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useChangeLocale, useCurrentLocale } from "@/i18n/client";
import { type I18nConfig, i18nConfig } from "@/i18n/config";

export function LanguageSwitcher() {
  const changeLocale = useChangeLocale({ preserveSearchParams: true });
  const locale = useCurrentLocale();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Content Language</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => {
            changeLocale(value as I18nConfig["locales"][number]["key"]);
          }}
        >
          {i18nConfig.locales.map((locale) => (
            <DropdownMenuRadioItem key={locale.key} value={locale.key}>
              {locale.displayName}{" "}
              {locale.key === i18nConfig.defaultLocale ? "(Default)" : ""}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
