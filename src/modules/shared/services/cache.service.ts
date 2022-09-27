import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async setKey(key: string, data: string, date: number): Promise<void> {
    await this.cacheManager.set(key, data, { ttl: date });
  }

  public getKey(key: string): Promise<string | undefined> {
    return this.cacheManager.get(key);
  }

  public removeKey(key: string): Promise<any> {
    return this.cacheManager.del(key);
  }

  public removeAllNetworks(): Promise<any> {
    return this.cacheManager.reset();
  }
}
