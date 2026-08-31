"use client";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { themes } from "@/lib/theme";

export function DashboardAccentSwitcher({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Accent Color</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(value) => onChange(value)}
        >
          {Object.values(themes).map((theme) => (
            <DropdownMenuRadioItem key={theme.name} value={theme.className}>
              <span
                className="block size-6 rounded-full border-2 border-border"
                style={{ backgroundColor: theme.labelColor }}
              ></span>
              {theme.name} {theme.isDefault && "(Default)"}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
