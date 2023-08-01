import { Injectable } from '@angular/core';
import { Observable, catchError, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environments';

@Injectable({
  providedIn: 'root',
})
export class EngineerService {
  url = environment.apiUrl;
  constructor(private http: HttpClient) { }

  createEngineer(profileFormData: object): Observable<any> {
    return this.http.post(`${this.url}/engineers`, profileFormData);
  }

  getAllEngineers(): Observable<any> {
    return this.http.get<any>(`${this.url}/engineers`);
  }

  getEngineers(page: number, limit: number, country: string, selectedRoleType: string, selectedRoleLevel: string): Observable<any> {
    return this.http.get<any>(`${this.url}/engineers?page=${page}&limit=${limit}&country=${country}&roleType=${selectedRoleType}&roleLevel=${selectedRoleLevel}`);
  }

  getEngineersCount(): Observable<any> {
    return this.http.get(`${this.url}/count`)
  }

  getEngineer(engineerId: any): Observable<any> {
    return this.http.get(`${this.url}/engineers/${engineerId}`);
  }

  updateEngineer(engineer: any): Observable<any> {
    return this.http.put(`${this.url}/engineers/me`, engineer);
  }
}
