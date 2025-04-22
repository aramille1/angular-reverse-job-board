import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { AdminAuthService } from 'src/app/services/admin-auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  recruiters: any[] = [];
  expandedRecruiterId: string | null = null;
  isLoading: boolean = true;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private adminService: AdminService,
    private adminAuthService: AdminAuthService
  ) { }

  ngOnInit(): void {
    this.loadRecruiters();
  }

  loadRecruiters(): void {
    this.isLoading = true;
    this.subscriptions.add(
      this.adminService.getAllRecruiters().subscribe({
        next: (response) => {
          this.recruiters = response.recruiters || [];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading recruiters:', error);
          this.isLoading = false;
        }
      })
    );
  }

  updateStatus(recruiter: any, status: boolean): void {
    this.subscriptions.add(
      this.adminService.updateRecruiterStatus(recruiter.ID, status).subscribe({
        next: () => {
          recruiter.is_member = status;
        },
        error: (error) => {
          console.error('Error updating recruiter status:', error);
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
