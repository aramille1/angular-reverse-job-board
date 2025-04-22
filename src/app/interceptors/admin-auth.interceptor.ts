import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminAuthService } from '../services/admin-auth.service';
import { environment } from 'environments/environments';

@Injectable()
export class AdminAuthInterceptor implements HttpInterceptor {
  private apiUrl = environment.apiUrl;

  constructor(private adminAuthService: AdminAuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only add the token for adminski API requests
    if (request.url.includes(`${this.apiUrl}/adminski`)) {
      const adminToken = this.adminAuthService.getAdminToken();

      if (adminToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${adminToken}`
          }
        });
      }
    }

    return next.handle(request);
  }
}
