import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environments';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = environment.apiUrl;
  engineerImg:string;
  engineerImageChange = new Subject<string>();
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.updateLoginStatus();
    this.engineerImageChange.subscribe(value => this.engineerImg = value);
  }

  /**
   * Updates the login status based on token presence and expiration
   */
  private updateLoginStatus(): void {
    const token = localStorage.getItem('token');
    const expires = localStorage.getItem('expires');

    if (token && expires) {
      const expiryTime = parseInt(expires, 10) * 1000; // Convert to milliseconds
      const isValid = expiryTime > Date.now();
      this._isLoggedIn$.next(isValid);

      // If token is expired, clean up
      if (!isValid) {
        localStorage.removeItem('token');
        localStorage.removeItem('expires');
      }
    } else {
      this._isLoggedIn$.next(false);
    }
  }

  /**
   * Check if the user is currently logged in
   * @returns boolean indicating if user is logged in with a valid token
   */
  isLoggedIn(): boolean {
    this.updateLoginStatus(); // Always check current status
    return this._isLoggedIn$.value;
  }

  getMyProfile(): Observable<any> {
    return this.http.get(`${this.url}/me`);
  }

  signin(loginData: object): Observable<any> {
    return this.http.post(`${this.url}/login`, loginData);
  }

  signup(signupData: object): Observable<any> {
    return this.http.post(`${this.url}/sign-up`, signupData);
  }

  setIsLoggedIn(val: boolean) {
    this._isLoggedIn$.next(val);
  }

  signout() {
    this._isLoggedIn$.next(false);
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
    this.router.navigate(['signin']);
  }
}
