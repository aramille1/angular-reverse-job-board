import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { EngineersComponent } from './components/engineers/engineers.component';
import { ProfileUpdateComponent } from './components/profile-update/profile-update.component';
import { RoleGuard } from 'src/app/guards/role-guard/role.guard';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { UpdateProfileRoleGuard } from 'src/app/guards/update-profile-role-guard/update-profile-role.guard';

const routes: Routes = [
  // anyone can access only if you are logged in
  { path: '', component: EngineersComponent },
  {
    path: 'details/:id',
    component: ProfileDetailsComponent,
  },
  {
    path: 'form',
    component: ProfileFormComponent,
    // can access if you are logged in, but no role yet
    canActivate: [AuthGuard, RoleGuard],
    data: {
      role: 'recruiter',
    },
  },
  {
    path: 'update/:id',
    component: ProfileUpdateComponent,
    // can access if you are logged in as engineer
    canActivate: [AuthGuard, UpdateProfileRoleGuard],
    data: {
      role: 'recruiter',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EngineersRoutingModule {}
