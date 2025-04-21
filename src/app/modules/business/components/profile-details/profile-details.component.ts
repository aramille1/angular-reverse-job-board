import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ApprovalStatus } from 'src/app/shared/enums/approval-status.enum';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  recruiter: any;
  private myProfileSub: Subscription;
  approvalStatus: ApprovalStatus = ApprovalStatus.PENDING;
  isLoading: boolean = true;

  // Make enum accessible in the template
  ApprovalStatus = ApprovalStatus;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    // Set loading state
    this.isLoading = true;

    this.myProfileSub = this.auth.getMyProfile().subscribe({
      next: (res) => {
        this.recruiter = res.user;
        // In a real scenario, you would get the approval status from an API
        // For now, we're just using the default PENDING status

        // Set loading to false once data is received
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.myProfileSub) {
      this.myProfileSub.unsubscribe();
    }
  }
}
