import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getOrSet<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    const cached = await this.cacheManager.get<T>(key);
    if (cached) return cached;

    const lockKey = `lock:${key}`;
    const isLocked = await this.cacheManager.get(lockKey);

    if (isLocked) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.getOrSet(key, fetchFn);
    }

    await this.cacheManager.set(lockKey, 1, 5000);
    try {
      const data = await fetchFn();
      await this.cacheManager.set(key, data);
      return data;
    } finally {
      await this.cacheManager.del(lockKey);
    }
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
