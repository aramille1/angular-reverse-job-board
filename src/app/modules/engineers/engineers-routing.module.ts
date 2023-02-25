import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { EngineersComponent } from './components/engineers/engineers.component';
import { ProfileUpdateComponent } from './components/profile-update/profile-update.component';

const routes: Routes = [
  { path: '', component: EngineersComponent },
  { path: 'details/:id', component: ProfileDetailsComponent },
  { path: 'form', component: ProfileFormComponent },
  { path: 'update', component: ProfileUpdateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EngineersRoutingModule {}
