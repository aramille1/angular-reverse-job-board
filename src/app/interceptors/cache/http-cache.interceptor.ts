import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, share } from 'rxjs/operators';

/**
 * HttpCacheInterceptor
 *
 * This interceptor caches GET requests to improve application performance.
 * Cached requests are stored in-memory for the lifetime of the application session.
 */
@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, HttpResponse<any>>();
  private ongoingRequests = new Map<string, Observable<HttpEvent<any>>>();

  constructor() {}

  /**
   * Intercept HTTP requests and implement caching for GET requests
   *
   * @param request The original HTTP request
   * @param next The HTTP handler to pass the request to
   * @returns An observable of the HTTP event
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    // Create a cache key based on the request URL
    const cacheKey = this.createCacheKey(request);

    // Check if this request is already ongoing
    const ongoingRequest = this.ongoingRequests.get(cacheKey);
    if (ongoingRequest) {
      return ongoingRequest;
    }

    // Check if we have a cached response
    const cachedResponse = this.cache.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse.clone());
    }

    // If not cached and not ongoing, make the request and cache the response
    const sharedRequest = next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(cacheKey, event.clone());
          this.ongoingRequests.delete(cacheKey);
        }
      }),
      share()
    );

    this.ongoingRequests.set(cacheKey, sharedRequest);
    return sharedRequest;
  }

  /**
   * Create a cache key from the request
   *
   * @param request The HTTP request
   * @returns A string to use as a cache key
   */
  private createCacheKey(request: HttpRequest<unknown>): string {
    return request.urlWithParams;
  }

  /**
   * Clear the entire cache or specific entries
   *
   * @param url Optional URL to clear only specific cache entries
   */
  clearCache(url?: string): void {
    if (url) {
      // Clear specific cache entries that match the URL
      const keysToDelete = Array.from(this.cache.keys())
        .filter(key => key.startsWith(url));

      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      // Clear all cache
      this.cache.clear();
    }
  }
}
