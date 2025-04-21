import { ApprovalStatus } from '../enums/approval-status.enum';

export interface ApprovalRequest {
  id: string;
  itemId: string;
  itemType: string;
  requestDate: Date;
  status: ApprovalStatus;
  requestedBy: string;
  approvedBy?: string;
  approvalDate?: Date;
  rejectionReason?: string;
}
