"use client";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocalFormatter } from "@/hooks/use-locale-formatter";
import { sharedConfig } from "@/lib/config/shared-config";
import type { LanguageCode } from "@/lib/dto/language-code";

export function DashboardLanguageSwitcher({
  value,
  onChange,
}: {
  value: LanguageCode;
  onChange: (value: LanguageCode) => void;
}) {
  const { formatLanguageName } = useLocalFormatter();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Content Language</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(value) => {
            onChange(value as LanguageCode);
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
