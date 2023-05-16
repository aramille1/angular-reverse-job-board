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
    const token = localStorage.getItem('token');
    this._isLoggedIn$.next(!!token);
    this.engineerImageChange.subscribe(value => this.engineerImg = value)
  }

  getMyProfile(): Observable<any> {
    return this.http.get(`${this.url}/me`);
  }

  getMyImage(){
    return this.http.get(`${this.url}/me`)
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

  signout(){
    this._isLoggedIn$.next(false);
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
    this.router.navigate(['signin']);
  }
}
