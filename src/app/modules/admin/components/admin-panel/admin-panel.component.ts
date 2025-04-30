import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { AdminAuthService } from 'src/app/services/admin-auth.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { EngineerService } from 'src/app/services/engineer-service/engineer.service';
import { UserService, UserEmailResponse } from 'src/app/services/user.service';

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
  UserID?: string;
  CreatedAt?: string;
}

interface Engineer {
  ID: string;
  Firstname: string;
  Lastname: string;
  Email: string;
  Tagline: string;
  Bio: string;
  Avatar?: string;
  Github?: string;
  LinkedIn?: string;
  Website?: string;
  City?: string;
  Country?: string;
  UserID?: string;
  CreatedAt?: string;
}

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  recruiters: Recruiter[] = [];
  engineers: Engineer[] = [];
  expandedRecruiterId: string | null = null;
  expandedEngineerId: string | null = null;
  isLoadingRecruiters: boolean = true;
  isLoadingEngineers: boolean = true;
  private subscriptions: Subscription = new Subscription();

  // Track status updates to prevent race conditions
  private pendingStatusUpdates = new Map<string, boolean>();

  constructor(
    private adminService: AdminService,
    private adminAuthService: AdminAuthService,
    private engineerService: EngineerService,
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadRecruiters();
    this.loadEngineers();
  }

  loadRecruiters(): void {
    this.isLoadingRecruiters = true;
    this.subscriptions.add(
      this.adminService.getAllRecruiters().subscribe({
        next: (response) => {
          // Apply any pending status updates that haven't been reflected from the server yet
          this.recruiters = (response.recruiters || []).map((recruiter: Recruiter) => {
            if (this.pendingStatusUpdates.has(recruiter.ID)) {
              recruiter.IsMember = this.pendingStatusUpdates.get(recruiter.ID) || false;
            }

            // If there's a UserID property, fetch the email
            if (recruiter.UserID) {
              this.fetchUserEmail(recruiter.UserID, (response) => {
                recruiter.Email = response.email;
                recruiter.CreatedAt = response.createdAt;
              });
            }

            return recruiter;
          });
          this.isLoadingRecruiters = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error loading recruiters:', error);
          this.isLoadingRecruiters = false;

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

  loadEngineers(): void {
    this.isLoadingEngineers = true;
    this.subscriptions.add(
      this.engineerService.getAllEngineers().subscribe({
        next: (response) => {
          // Get the 5 most recent engineers
          this.engineers = (response.engineers || [])
            .slice(0, 5)
            .map((engineer: any) => {
              const mappedEngineer = {
                ID: engineer.ID,
                Firstname: engineer.Firstname,
                Lastname: engineer.Lastname,
                Email: '',
                Tagline: engineer.Tagline,
                Bio: engineer.Bio,
                Avatar: engineer.Avatar,
                Github: engineer.Github,
                LinkedIn: engineer.LinkedIn,
                Website: engineer.Website,
                City: engineer.City,
                Country: engineer.Country,
                UserID: engineer.UserID, // Save UserID to fetch email
                CreatedAt: undefined as string | undefined
              };

              // If there's a UserID property, fetch the email
              if (engineer.UserID) {
                this.fetchUserEmail(engineer.UserID, (response) => {
                  mappedEngineer.Email = response.email;
                  mappedEngineer.CreatedAt = response.createdAt;
                });
              }

              return mappedEngineer;
            });
          this.isLoadingEngineers = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error loading engineers:', error);
          this.isLoadingEngineers = false;
          this.toastr.error('Failed to load engineers', 'Error');
        }
      })
    );
  }

  // Helper method to fetch user emails
  private fetchUserEmail(userId: string, callback: (response: UserEmailResponse) => void): void {
    this.subscriptions.add(
      this.userService.getUserEmailById(userId).subscribe({
        next: (response) => {
          if (response) {
            callback(response);
          }
        },
        error: (error) => {
          console.error('Error fetching user email:', error);
          callback({ email: 'Email not available' });
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

  toggleEngineerDetails(engineerId: string): void {
    if (this.expandedEngineerId === engineerId) {
      // If the same engineer is clicked, collapse it
      this.expandedEngineerId = null;
    } else {
      // Otherwise, expand the clicked engineer
      this.expandedEngineerId = engineerId;
    }
  }

  isExpanded(recruiterId: string): boolean {
    return this.expandedRecruiterId === recruiterId;
  }

  isEngineerExpanded(engineerId: string): boolean {
    return this.expandedEngineerId === engineerId;
  }

  logout(): void {
    this.adminAuthService.logout();
  }

  // Method to refresh recruiters data
  refreshRecruiters(): void {
    this.loadRecruiters();
  }

  // Method to refresh engineers data
  refreshEngineers(): void {
    this.loadEngineers();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
