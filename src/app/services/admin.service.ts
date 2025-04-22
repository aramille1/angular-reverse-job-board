import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;
  private adminskiUrl = `${this.apiUrl}/adminski`;

  constructor(private http: HttpClient) { }

  /**
   * Get all recruiters (business profiles)
   */
  getAllRecruiters(): Observable<any> {
    return this.http.get(`${this.adminskiUrl}/recruiters`);
  }

  /**
   * Update recruiter approval status
   * @param recruiterId The ID of the recruiter
   * @param isMember The approval status (true = approved, false = pending)
   */
  updateRecruiterStatus(recruiterId: string, isMember: boolean): Observable<any> {
    return this.http.patch(`${this.adminskiUrl}/recruiters/${recruiterId}/status`, { is_member: isMember });
  }
}
