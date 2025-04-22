import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environments';
import { Admin } from '../models/admin.model';
import { ApprovalStatus } from '../shared/enums/approval-status.enum';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private url = environment.apiUrl;
  private _isAdminLoggedIn$ = new BehaviorSubject<boolean>(false);
  isAdminLoggedIn$ = this._isAdminLoggedIn$.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const adminToken = localStorage.getItem('admin_token');
    this._isAdminLoggedIn$.next(!!adminToken);
  }

  adminLogin(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.url}/admin/login`, credentials).pipe(
      tap((res: any) => {
        if (res && res.token) {
          localStorage.setItem('admin_token', res.token);
          this._isAdminLoggedIn$.next(true);
        }
      })
    );
  }

  adminLogout(): void {
    localStorage.removeItem('admin_token');
    this._isAdminLoggedIn$.next(false);
    this.router.navigate(['/adminski/login']);
  }

  isAdminLoggedIn(): boolean {
    return !!localStorage.getItem('admin_token');
  }

  // Get all pending recruiters (not approved or rejected)
  getPendingRecruiters(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/admin/recruiters?status=pending`);
  }

  // Approve a recruiter
  approveRecruiter(recruiterId: string): Observable<any> {
    return this.http.patch(`${this.url}/admin/recruiters/${recruiterId}/approve`, {});
  }

  // Reject a recruiter
  rejectRecruiter(recruiterId: string, reason?: string): Observable<any> {
    return this.http.patch(`${this.url}/admin/recruiters/${recruiterId}/reject`, { reason });
  }

  // Get all recruiters with pagination and filters
  getAllRecruiters(page: number = 1, limit: number = 10, status?: ApprovalStatus): Observable<any> {
    let url = `${this.url}/admin/recruiters?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<any>(url);
  }
}
