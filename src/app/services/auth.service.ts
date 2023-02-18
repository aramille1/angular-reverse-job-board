import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const GOOGLE_MAPS_API_KEY = 'AIzaSyCaKbVhcX_22R_pRKDYuNA7vox-PtGaDkI';
const httpOptions = {
  withCredentials: true
 };
export type Maps = typeof google.maps;
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    const token = localStorage.getItem('token');
    console.log(token);

    this._isLoggedIn$.next(!!token);
  }

  getEngineers(){
    this.http.get('http://localhost:3000/engineers').subscribe({
      next:(res)=>{
        console.log(res)
      },
      error: (e) => alert(e),
    })
  }

  createEngineer(profileForm: any) {
    if (profileForm.valid) {
      console.log(profileForm.value);
      this.http
        .post('http://localhost:3000/engineer', profileForm.value, httpOptions)
        .subscribe(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          },
          () => {
            console.log('done!');
            this.router.navigate(['engineers/details/:id']);
          }
        );
    }
  }

  signin(signinForm: any) {
    const headers = new HttpHeaders({ 'Content-type': 'application/json' });
    const reqObject = {
      email: signinForm.value.email,
      password: signinForm.value.password,
    };

    this.http
      .post('http://localhost:3000/login', reqObject, { headers: headers })
      .subscribe(
        (response: any) => {
          const parsedToken = JSON.parse(
            atob(response['auth_token'].split('.')[1])
          );
          console.log(response);

          localStorage.setItem('token', response['auth_token']);
          localStorage.setItem('expires', JSON.stringify(parsedToken.exp));
        },
        (error) => {
          console.log(error);
        },
        () => {
          console.log('done!');
          this.router.navigate(['role']);
        }
      );
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
    this._isLoggedIn$.next(false);
    localStorage.removeItem('token');
    this.router.navigate(['signin']);
  }

  public readonly api = this.load();

  private load() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    // tslint:disable-next-line:no-bitwise
    const callbackName = `GooglePlaces_cb_` + ((Math.random() * 1e9) >>> 0);
    script.src = this.getScriptSrc(callbackName);

    interface MyWindow {
      [name: string]: Function;
    }
    const myWindow: MyWindow = window as any;

    const promise = new Promise((resolve, reject) => {
      myWindow[callbackName] = resolve;
      script.onerror = reject;
    });
    document.body.appendChild(script);
    return promise.then(() => google.maps);
  }

  private getScriptSrc(callback: string): string {
    interface QueryParams {
      [key: string]: string;
    }
    const query: QueryParams = {
      v: '3',
      callback,
      key: GOOGLE_MAPS_API_KEY,
      libraries: 'places',
    };
    const params = Object.keys(query)
      .map((key) => `${key}=${query[key]}`)
      .join('&');
    return `//maps.googleapis.com/maps/api/js?${params}&language=en`;
  }

  getProfile() {
    this.http
      .get<any>('http://localhost:3000/engineer/${engineerId}')
      .subscribe(
        (response) => {
          if (response) {
            console.log(response);
          }
        },

        (error) => {
          if (error.status === 401) {
            console.log(
              'You are not authorized to visit this route.  No data is displayed.'
            );
          }

          console.log(error);
        },

        () => {
          console.log('HTTP request done');
        }
      );
  }
}
