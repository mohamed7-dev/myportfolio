import React, { useTransition } from "react";
import { setAccentColor } from "@/api/actions/set-accent-color.action";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { ACCENT_COLOR_CLASSNAME_KEY } from "@/lib/constants";
import { themes } from "@/lib/theme";

export function AccentSwitcher({ mode }: { mode: "dashboard" | "public" }) {
  const [accentClassName, setAccentClassName] = React.useState("");

  const [_, startTransition] = useTransition();

  const onChange = (value: string) => {
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

    startTransition(async () => {
      setAccentClassName(value);
      await setAccentColor(value);
    });
  };

  React.useEffect(() => {
    const getAccentColor = async () => {
      const accent = await window.cookieStore.get(ACCENT_COLOR_CLASSNAME_KEY);
      if (accent?.value) {
        setAccentClassName(accent.value);
      }
    };
    getAccentColor();
  }, []);

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
            className="block size-6 rounded-base border-2 border-border relative"
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
