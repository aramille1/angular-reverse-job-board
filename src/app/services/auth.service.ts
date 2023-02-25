import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, switchMap } from "rxjs/operators";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Engineer } from '../engineer';

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
  userId:any;
  constructor(private router: Router, private http: HttpClient, private jwtHelper: JwtHelperService) {
    const token = localStorage.getItem('token');
    console.log(token);

    this._isLoggedIn$.next(!!token);
  }

  getEngineers():Observable<any>{
   return this.http.get<any>('http://localhost:3000/engineers')
  }

  getUserId(): Observable<any>{
    return of(localStorage.getItem('token')).pipe(
      switchMap((jwt: any) => of(this.jwtHelper.decodeToken(jwt)).pipe(
        tap((jwt) => console.log(jwt)),
        map((jwt: any) => jwt.userId)
      )
    ));
  }

  createEngineer(profileFormData: any) {
    if (profileFormData) {
      this.http
        .post('http://localhost:3000/engineers', JSON.stringify(profileFormData), httpOptions)
        .subscribe(
          (response:any) => {
            console.log(response);
            localStorage.setItem('engineerId', response.engineerId)
            this.router.navigate(['engineers/details', response.engineerId]);
          },
          (error) => {
            console.log(error);
          },
          () => {
            console.log('done!');

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
        {
          next: (response: any) => {
            const parsedToken = JSON.parse(
              atob(response['auth_token'].split('.')[1])
            );
            this.userId = parsedToken.userId;

            localStorage.setItem('token', response['auth_token']);
            localStorage.setItem('expires', JSON.stringify(parsedToken.exp));
            console.log('done!');
            this.router.navigate(['role']);
          },
          error: (error) => {
            console.log(error);
          }
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
    localStorage.removeItem('expires');
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

  findOne(id: string): Observable<any> {
    return this.http.get(`http://localhost:3000/engineers/${id}`).pipe(
      tap((engineer) => console.log(engineer)),
      map((engineer) => engineer)
    )
  }

  getProfileToUpdate() {
    // console.log("userId in auth", this.userId);
    const id = localStorage.getItem('engineerId')
    console.log(id);


   return this.http.get(`http://localhost:3000/engineers/${id}`)
  }

  getProfileDetails(engineerId:any){
    return this.http.get(`http://localhost:3000/engineers/${engineerId}`)
  }
}
