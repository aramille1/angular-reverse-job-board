import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'environments/environments';
// import { Engineer } from '../engineer';

// const httpOptions = {
//   withCredentials: true
//  };
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = environment.apiUrl
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    const token = localStorage.getItem('token');
    this._isLoggedIn$.next(!!token);
  }

  getUserId(): Observable<any> {
    return of(localStorage.getItem('token')).pipe(
      switchMap((jwt: any) =>
        of(this.jwtHelper.decodeToken(jwt)).pipe(
          tap((jwt) => console.log(jwt)),
          map((jwt: any) => jwt.userId)
        )
      )
    );
  }

  getMyProfile(): Observable<any>{
    return this.http.get(`${this.url}/me`)
  }

  signin(signinForm: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    const reqObject = {
      email: signinForm.value.email,
      password: signinForm.value.password,
    };

    return this.http
      .post(`${this.url}/login`, reqObject, { headers: headers })
  }

  signup(signupForm: any) {
    this.http
      .post<any>(`${this.url}/signup`, signupForm.value)
      .subscribe({
        next: () => {
          alert('user registered successfully');
          signupForm.reset();
          this.router.navigate(['signin']);
        },
        error: (e) => alert(e),
      });
  }

  signout() {
    this._isLoggedIn$.next(false);
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
    this.router.navigate(['signin']);
  }

  setIsLoggedIn(val:boolean){
    this._isLoggedIn$.next(val);
  }
}
