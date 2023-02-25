import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EngineersRoutingModule } from './engineers-routing.module';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { EngineersComponent } from './components/engineers/engineers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileUpdateComponent } from './components/profile-update/profile-update.component';


@NgModule({
  declarations: [
    ProfileDetailsComponent,
    ProfileFormComponent,
    EngineersComponent,
    ProfileUpdateComponent
  ],
  imports: [
    CommonModule,
    EngineersRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EngineersModule { }
