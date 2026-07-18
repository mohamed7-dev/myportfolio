import { useRouter } from "next/navigation";
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

export function AccentSwitcher() {
  const router = useRouter();

  const [accentClassName, setAccentClassName] = React.useState("");
  const changeAccent = async (accent: string) => {
    await setAccent(accent);

    router.refresh();
  };

  React.useEffect(() => {
    const getAccentFromCookieStore = async () => {
      const accent = await window.cookieStore.get("accent");
      setAccentClassName(accent?.value ?? "");
    };
    getAccentFromCookieStore();
  }, []);
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
          {themes.map((theme) => (
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
