import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeRoutePath(path: string) {
  const cleanPath = path.split(/[?#]/, 1)[0] ?? "/";
  const withoutTrailingSlash =
    cleanPath.length > 1 ? cleanPath.replace(/\/+$/, "") : cleanPath;
  const normalizedPath =
    withoutTrailingSlash === "" ? "/" : withoutTrailingSlash;

  const withoutLocale =
    normalizedPath.replace(/^\/[a-z]{2}(?:-[a-z]{2})?(?=\/|$)/i, "") || "/";

  return withoutLocale === "" ? "/" : withoutLocale;
}

export function isRouteActive(currentPath: string, targetPath: string) {
  const current = normalizeRoutePath(currentPath);
  const target = normalizeRoutePath(targetPath);

  if (target === "/") {
    return current === "/";
  }

  return current === target || current.startsWith(`${target}/`);
}
