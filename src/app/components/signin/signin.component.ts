import { Subscription } from 'rxjs';
import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  showError: Boolean = false;
  profile: any;
  private signinSub: Subscription;

  // form initialization
  signinForm = this.fb.group({
    email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')],
    password: [
      '12345678',
      Validators.compose([Validators.required, Validators.minLength(8)]),
    ],
  });
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService
  ) {}


  signin() {
    if (this.signinForm.invalid) {
      return;
    }
    const reqObject = {
      email: this.signinForm.value.email,
      password: this.signinForm.value.password,
    };
    this.auth.signin(reqObject).subscribe({
      next: (response) => {
        const parsedToken = JSON.parse(
          atob(response['auth_token'].split('.')[1])
        );
        localStorage.setItem('token', response['auth_token']);
        localStorage.setItem('expires', JSON.stringify(parsedToken.exp));
        this.auth.setIsLoggedIn(true);
        console.log('loggedin!');
        this.auth.getMyProfile().subscribe({
          next: (res) => {
            // sending data of loggedin user to commonService
            // so it can go to header next
            this.commonService.updateUserData(res);
            this.router.navigate(['']);
          },
          error: () => {
            console.log(
              'you are logged in! but your profile as engineer/recruiter doesnt exist yet'
            );
            this.router.navigate(['role']);
          },
        });
      },
      error: (err) => {
        new Error(err);
        this.showError = true;
      },
    });
  }

  // ngOnDestroy(): void {
  //   this.signinSub.unsubscribe();
  // }
}
