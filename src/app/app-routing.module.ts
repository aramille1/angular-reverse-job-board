import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { RoleComponent } from './components/role/role.component';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { SigninGuard } from './guards/signin.guard';

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full'},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'signin', component: SigninComponent}, // TODO implement Authguard only signin
  {path: 'signup', component: SignupComponent}, // TODO implement Authguard only signup
  {path: 'role', component: RoleComponent},
  {path: 'pricing', component: PricingComponent},
  {
    path: 'engineers',
    // canActivate:[AuthGuard],
    loadChildren: () =>
    import('./modules/engineers/engineers.module').then((m) => m.EngineersModule)},

  // {path: '', redirectTo: 'signin', pathMatch: 'full'}
  {path: 'business',     canActivate:[AuthGuard], loadChildren: () => import('./modules/business/business.module').then((m) => m.BusinessModule)},
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
