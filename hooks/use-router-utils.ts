import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

  return { updateSearchParams, searchParams };
}
