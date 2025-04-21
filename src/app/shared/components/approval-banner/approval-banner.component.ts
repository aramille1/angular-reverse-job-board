import { Component, Input } from '@angular/core';
import { ApprovalStatus } from 'src/app/models/approval-status.enum';

@Component({
  selector: 'app-approval-banner',
  templateUrl: './approval-banner.component.html',
  styleUrls: ['./approval-banner.component.scss']
})
export class ApprovalBannerComponent {
  @Input() status: ApprovalStatus = ApprovalStatus.PENDING;

  // Make enum accessible in the template
  ApprovalStatus = ApprovalStatus;

  getMessage(): string {
    switch (this.status) {
      case ApprovalStatus.PENDING:
        return "We are reviewing your info. It's usually done within few hours. We will send you an email once we confirm. Until then you cannot see all engineers.";
      case ApprovalStatus.APPROVED:
        return "Your profile has been approved. You can now access all features.";
      case ApprovalStatus.REJECTED:
        return "Your profile has been rejected. Please contact support for more information.";
      default:
        return "";
    }
  }

  getStatusColor(): string {
    switch (this.status) {
      case ApprovalStatus.PENDING:
        return "warning"; // orange
      case ApprovalStatus.APPROVED:
        return "success"; // green
      case ApprovalStatus.REJECTED:
        return "danger"; // red
      default:
        return "secondary"; // gray
    }
  }
}
