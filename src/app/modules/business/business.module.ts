import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing.module';
import { BusinessComponent } from './components/business/business.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileUpdateComponent } from './components/profile-update/profile-update.component';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    BusinessComponent,
    ProfileDetailsComponent,
    ProfileFormComponent,
    ProfileUpdateComponent
  ],
  imports: [
    CommonModule,
    BusinessRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingBarModule,
    SharedModule,
  ]
})
export class BusinessModule { }
