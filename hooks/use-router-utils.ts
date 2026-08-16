import { useSearchParams } from "next/navigation";
import React from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { apiUrl } from "@/lib/helpers/router";

export function useRouterUtils() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

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

  const getApiHandlerUrl = React.useCallback((path: string) => {
    return apiUrl(path);
  }, []);

  return { updateSearchParams, searchParams, getApiHandlerUrl };
}
