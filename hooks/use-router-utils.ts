import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import React from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

export function useRouterUtils() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentLocale = useLocale();

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const getApiHandlerUrl = React.useCallback(
    (path: string) => {
      return `${process.env.BASE_URL ?? "http://localhost:3000"}/${currentLocale}/api/${path}`;
    },
    [currentLocale],
  );

  return { updateSearchParams, searchParams, getApiHandlerUrl };
}
