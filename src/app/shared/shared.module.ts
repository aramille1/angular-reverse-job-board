import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalBannerComponent } from './components/approval-banner/approval-banner.component';
import { ApprovalWrapperComponent } from './components/approval-wrapper/approval-wrapper.component';

@NgModule({
  declarations: [
    ApprovalBannerComponent,
    ApprovalWrapperComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ApprovalBannerComponent,
    ApprovalWrapperComponent
  ]
})
export class SharedModule { }
