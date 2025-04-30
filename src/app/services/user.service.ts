import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'environments/environments';
import { HttpErrorResponse } from '@angular/common/http';

export interface UserEmailResponse {
  email: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Get user email by user ID
   * @param userId The UUID of the user
   */
  getUserEmailById(userId: string): Observable<UserEmailResponse> {
    return this.http.get<UserEmailResponse>(`${this.apiUrl}/adminski/users/${userId}/email`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}
