import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PublicPagesGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // If the user is logged in, redirect them to the home page
    if (this.authService.isLoggedIn()) {
      console.log('User is already logged in, redirecting from', state.url);
      this.toastr.info('You are already logged in', 'Information');
      this.router.navigate(['/']);
      return false;
    }

    // Otherwise, allow access to the public page
    console.log('User is not logged in, allowing access to', state.url);
    return true;
  }
}
