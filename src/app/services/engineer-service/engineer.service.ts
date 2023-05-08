import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environments';

@Injectable({
  providedIn: 'root',
})
export class EngineerService {
  url = environment.apiUrl;
  constructor(private http: HttpClient) {}

  createEngineer(profileFormData: object): Observable<any> {
    return this.http.post(`${this.url}/engineers`, profileFormData);
  }

  getAllEngineers(): Observable<any> {
    return this.http.get<any>(`${this.url}/engineers`);
  }

  getEngineers(page:number, limit: number, country: string): Observable<any> {
    console.log("page:", page)
    console.log("limit:", limit)
    console.log("country:", country)
    return this.http.get(`${this.url}/engineers?role_level=c_level)`);
  }

  getEngineer(engineerId: any): Observable<any> {
    return this.http.get(`${this.url}/engineers/${engineerId}`);
  }

  updateEngineer(engineer: any): Observable<any> {
    return this.http.put(`${this.url}/engineers/me`, engineer);
  }
}
