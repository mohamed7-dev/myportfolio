import React from "react";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { setAccent } from "@/lib/actions/set-accent";
import { themes } from "@/lib/theme";
import { Button } from "../ui/button";

export function AccentSwitcher({ mode }: { mode: "dashboard" | "public" }) {
  const [accentClassName, setAccentClassName] = React.useState("");

  const changeAccent = async (accent: string) => {
    await setAccent(accent);
  };

  React.useEffect(() => {
    const getAccentFromCookieStore = async () => {
      const accent = await window.cookieStore.get("accent");
      setAccentClassName(accent?.value ?? "");
    };
    getAccentFromCookieStore();
  }, []);

  if (mode === "dashboard") {
    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>Accent Color</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup
            value={accentClassName}
            onValueChange={(value) => {
              setAccentClassName(value);
              changeAccent(value);
            }}
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
        <Button
          key={theme.name}
          variant={accentClassName === theme.className ? "default" : "neutral"}
          size={"sm"}
          onClick={() => {
            setAccentClassName(theme.className);
            changeAccent(theme.className);
          }}
        >
          <span
            className="block size-6 rounded-full border-2 border-border relative"
            style={{ backgroundColor: theme.labelColor }}
          ></span>
          <span className="sr-only">
            {theme.name} {theme.isDefault && "(Default)"}
          </span>
        </Button>
      ))}
    </div>
  );
}
