import React from "react";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { setAccentColor } from "@/lib/helpers/accent-color-storage";
import { themes } from "@/lib/theme";

export function AccentSwitcher({ mode }: { mode: "dashboard" | "public" }) {
  const [accentClassName, setAccentClassName] = React.useState("");

  const onChange = (value: string) => {
    setAccentClassName(value);
    setAccentColor(value);
    const allAccentClassNames = Object.values(themes).map(
      (theme) => theme.className,
    );
    const documentElAccentClassName = allAccentClassNames.find((c) =>
      document.documentElement.classList.contains(c),
    );
    if (documentElAccentClassName) {
      document.documentElement.classList.remove(documentElAccentClassName);
    }
    if (value) {
      document.documentElement.classList.add(value);
    }
  };

  if (mode === "dashboard") {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Accent Color</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup
            value={accentClassName}
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

  return (
    <div className="flex items-center gap-2">
      {Object.values(themes).map((theme) => (
        <button
          type="button"
          key={theme.name}
          onClick={() => onChange(theme.className)}
        >
          <span
            className="block size-6 rounded-full border-2 border-border relative"
            style={{ backgroundColor: theme.labelColor }}
          ></span>
          <span className="sr-only">
            {theme.name} {theme.isDefault && "(Default)"}
          </span>
        </button>
      ))}
    </div>
  );
}
