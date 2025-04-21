import { Component, Input } from '@angular/core';
import { ApprovalStatus } from 'src/app/models/approval-status.enum';

@Component({
  selector: 'app-approval-wrapper',
  templateUrl: './approval-wrapper.component.html',
  styleUrls: ['./approval-wrapper.component.scss']
})
export class ApprovalWrapperComponent {
  @Input() status: ApprovalStatus = ApprovalStatus.PENDING;

  // Make enum accessible in the template
  ApprovalStatus = ApprovalStatus;

  shouldBlockContent(): boolean {
    return this.status === ApprovalStatus.PENDING || this.status === ApprovalStatus.REJECTED;
  }
}
