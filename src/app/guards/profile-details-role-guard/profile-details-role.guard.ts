import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileDetailsRoleGuard implements CanActivate {
  constructor(private auth: AuthService, private route: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.getMyProfile().pipe(
      tap((profile: any) => {
        if (profile.type === route.data['role']) {
          // TODO message access not granted
          this.route.navigate(['/']);
          return false;
        }
        if (profile.type === 'recruiter') {
          return true;
        } else {
          return;
        }
      }),
      catchError((err) => {
        console.log(err.error.code);
        // if(err.error.code === "authentication.validate_token"){
        this.route.navigate(['/']);

        return of(false);
        // }
      })
    );
  }
}
