import { Injectable } from '@angular/core';
import { HttpCacheInterceptor } from './http-cache.interceptor';

/**
 * HttpCacheService
 *
 * Service to manage the HTTP cache. Provides methods to clear the cache
 * for specific URLs or the entire cache.
 */
@Injectable({
  providedIn: 'root'
})
export class HttpCacheService {

  constructor(private httpCacheInterceptor: HttpCacheInterceptor) { }

  /**
   * Clear cache for a specific URL or pattern
   *
   * @param url The URL or pattern to clear from cache
   */
  clearCacheForUrl(url: string): void {
    this.httpCacheInterceptor.clearCache(url);
  }

  /**
   * Clear all HTTP cache
   */
  clearCache(): void {
    this.httpCacheInterceptor.clearCache();
  }
}
