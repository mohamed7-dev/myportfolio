import { themes } from "../theme";

export const ACCENT_COLOR_CLASSNAME_LS_KEY = "accent-color";

export function setAccentColor(accentColorClassName?: string) {
  localStorage.setItem(
    ACCENT_COLOR_CLASSNAME_LS_KEY,
    accentColorClassName ?? themes.lightEmerald.className,
  );
}

export function getAccentColor() {
  return (
    localStorage.getItem(ACCENT_COLOR_CLASSNAME_LS_KEY) ??
    themes.lightEmerald.className
  );
}
