import type { CacheEntryOptions } from "@/lib/config/cache-strategy.interface";
import { serverConfig } from "@/lib/config/server-config";
import type { JSONCompatible } from "@/lib/types/shared-types";

const ContextName = "ConfigService";

class CacheService {
  public async store<Value extends JSONCompatible<Value>>(
    key: string,
    value: Value,
    options?: CacheEntryOptions,
  ): Promise<void> {
    try {
      await serverConfig.system.cache.store(key, value, options);
      console.debug(`[${ContextName}]: Successfully stored key "${key}"`);
    } catch (error) {
      console.error(
        `[${ContextName}]: Failed to store key "${key}"`,
        (error as Error).stack,
      );
    }
  }

  public async retrieve<Value extends JSONCompatible<Value>>(
    key: string,
  ): Promise<Value | undefined> {
    try {
      const hit = await serverConfig.system.cache.retrieve<Value>(key);
      if (!hit) {
        console.debug(`[${ContextName}]: Hit on key "${key}"`);
      }
      return hit;
    } catch (error) {
      console.error(
        `[${ContextName}]: Failed to retrieve key "${key}"`,
        (error as Error).stack,
      );
    }
  }

  public async delete(key: string): Promise<void> {
    try {
      await serverConfig.system.cache.delete(key);
      console.debug(
        `[${ContextName}]: Successfully removed key "${key}"`,
        ContextName,
      );
    } catch (error) {
      console.error(
        `[${ContextName}]: Failed to remove key "${key}"`,
        (error as Error).stack,
      );
    }
  }

  public async purgeByTags(tags: string[]): Promise<void> {
    try {
      await serverConfig.system.cache.purgeByTags(tags);
      console.debug(
        `[${ContextName}]: Successfully purged cache entries with tags [${tags.join(", ")}]`,
      );
    } catch (error) {
      console.error(
        `[${ContextName}]: Failed to purge tags [${tags.join(", ")}]`,
        (error as Error).stack,
      );
    }
  }
}

export const cacheService = new CacheService();
