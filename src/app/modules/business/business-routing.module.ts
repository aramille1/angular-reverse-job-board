import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessComponent } from './components/business/business.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { ProfileUpdateComponent } from './components/profile-update/profile-update.component';

const routes: Routes = [
  { path: '', component: BusinessComponent },
  { path: 'details/:id', component: ProfileDetailsComponent },
  { path: 'form', component: ProfileFormComponent },
  { path: 'update/:id', component: ProfileUpdateComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
