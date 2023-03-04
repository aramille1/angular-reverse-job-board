import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  url = 'http://localhost:3000';
  constructor(private http: HttpClient, private router: Router) {}

  createRecruiter(profileFormData: any): Observable<any> {
      return this.http.post<any>(
        `${this.url}/recruiters`,
        profileFormData
      );
  }

  getRecruiter(id:any): Observable<any>{
    return this.http.get(`${this.url}/recruiters/${id}`)
  }
}