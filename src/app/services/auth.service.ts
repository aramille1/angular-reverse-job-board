import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    const token = localStorage.getItem('token')
    this._isLoggedIn$.next(!!token)
  }

  signin(signinForm: any) {
    this.http.get<any>('http://localhost:3000/signup').subscribe({
      next: (res) => {

        //match email and password
        console.log(res);
        const user = res.find((a: any) => {
          return (
            a.email === signinForm.value.email &&
            a.password === signinForm.value.password
          );
        });

        // condition for signin
        if (user) {
          this._isLoggedIn$.next(true)
          localStorage.setItem('token', 'abcdefghijklmnopqrstuvwxyz')

          // login is successfull!!!
          alert('successfully signed in');
          signinForm.reset();
          this.router.navigate(['role']);
        } else {
          alert('User not found with these credentials');
        }
      },
      error: (err) => alert('something went wrong '),
    });
  }

  signup(signupForm: any) {
    this.http
      .post<any>('http://localhost:3000/signup', signupForm.value)
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
    this._isLoggedIn$.next(false)
    localStorage.removeItem('token');
    this.router.navigate(['signin']);
  }
}
