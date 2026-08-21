import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { apiUrl } from "@/lib/helpers/router";

export function useRouterUtils() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const pendingSearchParamsRef = React.useRef<string | null>(null);

  const updateSearchParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(
        pendingSearchParamsRef.current ?? searchParams.toString(),
      );

      for (const [key, value] of Object.entries(updates)) {
        if (value === null) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      const query = params.toString();

      // prevents infinite rendering loops
      if (
        query === (pendingSearchParamsRef.current ?? searchParams.toString())
      ) {
        return;
      }

      // maintain an internal state of the search params that works synchronously
      pendingSearchParamsRef.current = query;

      router.push(`${pathname}?${query}`);
    },
    [pathname, router, searchParams],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: it should run when searchParams catches up
  React.useEffect(() => {
    // clean the state when the searchParams catches up
    pendingSearchParamsRef.current = null;
  }, [searchParams]);

  const getApiHandlerUrl = React.useCallback((path: string) => {
    return apiUrl(path);
  }, []);

  return { updateSearchParams, searchParams, getApiHandlerUrl };
}
