import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Skip adding auth headers for Cloudinary uploads
        if(req.url.includes("api.cloudinary.com")) {
          return next.handle(req);
        }

        // Check if this is an admin route
        if (req.url.includes('/admin/')) {
          const adminToken = localStorage.getItem("admin_token");

          // Add authorization header if admin token exists
          if (adminToken) {
            const cloned = req.clone({
              headers: req.headers.set("Authorization", `Bearer ${adminToken}`)
            });
            return next.handle(cloned);
          }
        } else {
          // Regular user authentication
          const idToken = localStorage.getItem("token");

        // Add authorization header if token exists
        if (idToken) {
          const cloned = req.clone({
            headers: req.headers.set("Authorization", `Bearer ${idToken}`)
          });
          return next.handle(cloned);
          }
        }

        return next.handle(req);
    }

    // this is a second option
    // shouldAddTheAuthorizationHeader(request: { url: string; }){
    //   const localHostUrl = environment.apiUrl;
    //   if(
    //     (request.url === `${localHostUrl}/me`) ||
    //     (request.url === `${localHostUrl}/engineers/me`) ||
    //     (request.url === `${localHostUrl}/engineers`) ||
    //     (request.url === `${localHostUrl}/recruiters/me`) ||
    //     (request.url === `${localHostUrl}/recruiters`)
    //     // || (request.url.includes("page"))
    //     ){
    //     return true
    //   }else{
    //     return false
    //   }
    // }
  }
