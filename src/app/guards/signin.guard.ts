import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SigninGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.auth.isLoggedIn$.pipe(
        tap((loggedIn: boolean) => {

          if (loggedIn) {
            console.log(loggedIn);
            this.router.navigate(['']);
            return false;
          }
          else{
            this.router.navigate(['/signin']);
            return false;
          }
        })
      );
    }

}
