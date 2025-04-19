import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const idToken = localStorage.getItem("token");

        // Skip adding auth headers for Cloudinary uploads
        if(req.url.includes("api.cloudinary.com")) {
          return next.handle(req);
        }

        // Add authorization header if token exists
        if (idToken) {
          const cloned = req.clone({
            headers: req.headers.set("Authorization", `Bearer ${idToken}`)
          });
          return next.handle(cloned);
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
