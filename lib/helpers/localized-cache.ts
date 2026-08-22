import { unstable_cache } from "next/cache";

export function localizedCache<TArgs extends unknown[], TResult>(
  callback: (locale: string, ...args: TArgs) => Promise<TResult>,
  keyParts: string[],
  options: { revalidate?: number; tags?: string[] },
) {
  return unstable_cache(callback as any, keyParts, options) as (
    locale: string,
    ...args: TArgs
  ) => Promise<TResult>;
}
