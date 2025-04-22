import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../services/admin.service';
import { ApprovalStatus } from '../../../../shared/enums/approval-status.enum';

@Component({
  selector: 'app-recruiter-list',
  templateUrl: './recruiter-list.component.html',
  styleUrls: ['./recruiter-list.component.scss']
})
export class RecruiterListComponent implements OnInit {
  recruiters: any[] = [];
  loading: boolean = true;
  error: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;
  total: number = 0;
  selectedStatus: ApprovalStatus = ApprovalStatus.PENDING;

  // Make enum accessible in template
  ApprovalStatus = ApprovalStatus;

  // For modal
  showRejectModal: boolean = false;
  rejectionReason: string = '';
  selectedRecruiterId: string = '';

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadRecruiters();
  }

  loadRecruiters(): void {
    this.loading = true;
    this.adminService.getAllRecruiters(this.currentPage, this.limit, this.selectedStatus).subscribe({
      next: (response) => {
        // Adapt this response handling to match your Go backend's response structure
        // You may need to adjust this based on the actual response format
        if (Array.isArray(response)) {
          // If response is a direct array of recruiters
          this.recruiters = response;
          this.total = response.length;
        } else if (response && typeof response === 'object') {
          // If response is an object with metadata
          if (response.recruiters && Array.isArray(response.recruiters)) {
            this.recruiters = response.recruiters;
          } else if (response.data && Array.isArray(response.data)) {
            this.recruiters = response.data;
          }

          // Extract pagination data
          this.total = response.total || response.totalCount || this.recruiters.length;
          this.totalPages = response.totalPages || Math.ceil(this.total / this.limit);
        }

        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load recruiters. Please try again.';
        this.loading = false;
        console.error('Error loading recruiters:', error);
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadRecruiters();
  }

  onStatusChange(status: ApprovalStatus): void {
    this.selectedStatus = status;
    this.currentPage = 1; // Reset to first page when changing filters
    this.loadRecruiters();
  }

  approveRecruiter(recruiterId: string): void {
    this.loading = true;
    this.adminService.approveRecruiter(recruiterId).subscribe({
      next: (response) => {
        // Remove from the list if we're viewing pending recruiters
        if (this.selectedStatus === ApprovalStatus.PENDING) {
          this.recruiters = this.recruiters.filter(recruiter =>
            recruiter.id !== recruiterId && recruiter.ID !== recruiterId);
          this.total--;
          this.totalPages = Math.ceil(this.total / this.limit);
        }
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to approve recruiter. Please try again.';
        this.loading = false;
        console.error('Error approving recruiter:', error);
      }
    });
  }

  openRejectModal(recruiterId: string): void {
    this.selectedRecruiterId = recruiterId;
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.selectedRecruiterId = '';
    this.rejectionReason = '';
  }

  confirmReject(): void {
    if (!this.selectedRecruiterId) return;

    this.loading = true;
    this.adminService.rejectRecruiter(this.selectedRecruiterId, this.rejectionReason).subscribe({
      next: (response) => {
        // Remove from the list if we're viewing pending recruiters
        if (this.selectedStatus === ApprovalStatus.PENDING) {
          this.recruiters = this.recruiters.filter(recruiter =>
            recruiter.id !== this.selectedRecruiterId && recruiter.ID !== this.selectedRecruiterId);
          this.total--;
          this.totalPages = Math.ceil(this.total / this.limit);
        }
        this.closeRejectModal();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to reject recruiter. Please try again.';
        this.loading = false;
        this.closeRejectModal();
        console.error('Error rejecting recruiter:', error);
      }
    });
  }
}
