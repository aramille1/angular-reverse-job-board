import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private route: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.getMyProfile().pipe(
      tap((profile: any) => {
        if (profile.type === route.data['role']) {
          this.route.navigate(['/']);
          return false;
        }
        if (profile.type === 'recruiter') {
          this.route.navigate(['business/update', profile.user.ID]);
          return false;
        }
        if (profile.type === 'engineer') {
          this.route.navigate(['engineers/update', profile.user.ID]);
          return false;
        } else {
          return true;
        }
      }),
      catchError((err) => {
        // if(err.error.code === "authentication.validate_token"){
        return of(true);
        // }
      })
    );
  }
}
