import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing.module';
import { BusinessComponent } from './components/business/business.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BusinessComponent,
    ProfileDetailsComponent,
    ProfileFormComponent
  ],
  imports: [
    CommonModule,
    BusinessRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BusinessModule { }
