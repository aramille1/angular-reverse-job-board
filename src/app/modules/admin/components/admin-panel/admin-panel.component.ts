import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { AdminAuthService } from 'src/app/services/admin-auth.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

interface Recruiter {
  ID: string;
  Firstname: string;
  Lastname: string;
  Company: string;
  Email: string;
  Role: string;
  Bio: string;
  Logo?: string;
  LinkedIn?: string;
  Website?: string;
  IsMember: boolean;
}

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  recruiters: Recruiter[] = [];
  expandedRecruiterId: string | null = null;
  isLoading: boolean = true;
  private subscriptions: Subscription = new Subscription();

  // Track status updates to prevent race conditions
  private pendingStatusUpdates = new Map<string, boolean>();

  constructor(
    private adminService: AdminService,
    private adminAuthService: AdminAuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadRecruiters();
  }

  loadRecruiters(): void {
    this.isLoading = true;
    this.subscriptions.add(
      this.adminService.getAllRecruiters().subscribe({
        next: (response) => {
          // Apply any pending status updates that haven't been reflected from the server yet
          this.recruiters = (response.recruiters || []).map((recruiter: Recruiter) => {
            if (this.pendingStatusUpdates.has(recruiter.ID)) {
              recruiter.IsMember = this.pendingStatusUpdates.get(recruiter.ID) || false;
            }
            return recruiter;
          });
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error loading recruiters:', error);
          this.isLoading = false;

          // If unauthorized (401) or forbidden (403), automatically log out
          if (error.status === 401 || error.status === 403) {
            this.toastr.error('Your session has expired. Please log in again.', 'Session Expired');
            this.logout();
          } else {
            this.toastr.error('Failed to load recruiters', 'Error');
          }
        }
      })
    );
  }

  updateStatus(recruiter: Recruiter, status: boolean): void {
    // Store the pending update
    this.pendingStatusUpdates.set(recruiter.ID, status);

    // Update UI immediately for better user experience
    recruiter.IsMember = status;

    // Show loading state
    const statusText = status ? 'approved' : 'pending';
    this.toastr.info(`Updating status to ${statusText}...`, 'Processing');

    this.subscriptions.add(
      this.adminService.updateRecruiterStatus(recruiter.ID, status).subscribe({
        next: () => {
          // Update was successful, remove from pending
          this.pendingStatusUpdates.delete(recruiter.ID);
          this.toastr.success(`Recruiter status updated to ${statusText}`, 'Success');
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating recruiter status:', error);

          // Revert the UI status since the update failed
          recruiter.IsMember = !status;
          this.pendingStatusUpdates.delete(recruiter.ID);

          // If unauthorized (401) or forbidden (403), automatically log out
          if (error.status === 401 || error.status === 403) {
            this.toastr.error('Your session has expired. Please log in again.', 'Session Expired');
            this.logout();
          } else {
            this.toastr.error(`Failed to update status to ${statusText}`, 'Error');
          }
        }
      })
    );
  }

  toggleProfileDetails(recruiterId: string): void {
    if (this.expandedRecruiterId === recruiterId) {
      // If the same recruiter is clicked, collapse it
      this.expandedRecruiterId = null;
    } else {
      // Otherwise, expand the clicked recruiter
      this.expandedRecruiterId = recruiterId;
    }
  }

  isExpanded(recruiterId: string): boolean {
    return this.expandedRecruiterId === recruiterId;
  }

  logout(): void {
    this.adminAuthService.logout();
  }

  // Method to refresh recruiters data
  refreshRecruiters(): void {
    this.loadRecruiters();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
