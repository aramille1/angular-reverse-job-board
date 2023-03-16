import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateProfileRoleGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private route: Router,
    private toastr: ToastrService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.getMyProfile().pipe(
      tap((profile: any) => {
        if (profile.type === route.data['role']) {
          this.toastr.error('Access denied');
          this.route.navigate(['/']);
          return false;
        } else {
          return true;
        }
      }),
      catchError((err) => {
        console.log(err.error.code);
        // if(err.error.code === "authentication.validate_token"){
        this.route.navigate(['/role']);

        return of(true);
        // }
      })
    );
  }
}
