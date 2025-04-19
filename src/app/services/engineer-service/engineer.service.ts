import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'environments/environments';

// Backend model uses uppercase property names
interface Engineer {
  ID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  RoleType: string;
  RoleLevel: string;
  Country: string;
  Bio: string;
  Github: string;
  LinkedIn: string;
  Website: string;
  Avatar: string;
  // Add other properties as needed
}

// Frontend model uses lowercase property names
export interface EngineerProfile {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  roleType?: string | string[];
  roleLevel?: string | string[];
  country?: string;
  city?: string;
  bio?: string;
  avatar?: string;
  tagLine?: string;
  searchStatus?: boolean;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  stackoverflow?: string;
  // Add other properties as needed
}

interface EngineersResponse {
  engineers: Engineer[];
}

interface CountResponse {
  engineers_count: number;
}

@Injectable({
  providedIn: 'root',
})
export class EngineerService {
  url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }

  createEngineer(profileFormData: object): Observable<any> {
    return this.http.post(`${this.url}/engineers`, profileFormData)
      .pipe(catchError(this.handleError));
  }

  getAllEngineers(): Observable<EngineersResponse> {
    return this.http.get<EngineersResponse>(`${this.url}/engineers`)
      .pipe(catchError(this.handleError));
  }

  getEngineers(page: number, limit: number, country: string, selectedRoleType: string, selectedRoleLevel: string): Observable<EngineersResponse> {
    return this.http.get<EngineersResponse>(
      `${this.url}/engineers?page=${page}&limit=${limit}&country=${country}&roleType=${selectedRoleType}&roleLevel=${selectedRoleLevel}`
    ).pipe(catchError(this.handleError));
  }

  getEngineersCount(): Observable<CountResponse> {
    return this.http.get<CountResponse>(`${this.url}/count`)
      .pipe(catchError(this.handleError));
  }

  getEngineer(engineerId: string | number): Observable<{ engineer: Engineer }> {
    return this.http.get<{ engineer: Engineer }>(`${this.url}/engineers/${engineerId}`)
      .pipe(catchError(this.handleError));
  }

  updateEngineer(engineer: EngineerProfile): Observable<any> {
    return this.http.put(`${this.url}/engineers/me`, engineer)
      .pipe(catchError(this.handleError));
  }
}
