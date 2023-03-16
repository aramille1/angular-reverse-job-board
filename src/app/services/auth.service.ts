import { BehaviorSubject, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = environment.apiUrl;
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    this._isLoggedIn$.next(!!token);
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
}
