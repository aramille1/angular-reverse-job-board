import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'environments/environments';
import { Router } from '@angular/router';

interface AdminLoginResponse {
  admin: any;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private apiUrl = environment.apiUrl;
  private adminToken = 'admin_token';
  private adminRememberKey = 'admin_remember';

  private _isAdminLoggedIn$ = new BehaviorSubject<boolean>(this.hasValidAdminToken());
  isAdminLoggedIn$ = this._isAdminLoggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string, rememberMe: boolean): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.apiUrl}/api/admin/login`, { username, password })
      .pipe(
        tap(response => {
          // Save token to localStorage
          localStorage.setItem(this.adminToken, response.token);

          // Save remember me preference
          if (rememberMe) {
            localStorage.setItem(this.adminRememberKey, 'true');
          } else {
            localStorage.removeItem(this.adminRememberKey);
          }

          this._isAdminLoggedIn$.next(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.adminToken);
    this._isAdminLoggedIn$.next(false);
    this.router.navigate(['/adminski/login']);
  }

  getAdminToken(): string | null {
    return localStorage.getItem(this.adminToken);
  }

  private hasValidAdminToken(): boolean {
    // For a real application, you'd want to check if token is expired
    const token = this.getAdminToken();
    return !!token;
  }
}
