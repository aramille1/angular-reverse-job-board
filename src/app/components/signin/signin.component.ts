import { Subscription } from 'rxjs';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  showError: Boolean = false;
  fieldTextType: boolean;
  profile: any;
  // private signinSub: Subscription;
  loader = this.loadingBar.useRef();
  isLoading: boolean = false;
  // form initialization
  signinForm = this.fb.group({
    email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')],
    password: ['', Validators.required],
  });
  confirmEmailError: boolean = false;
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private loadingBar: LoadingBarService,
    private toastr: ToastrService
  ) { }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  ngOnInit(): void {
    this.loader.stop();
  }

  signin() {
    this.loader.start();
    this.isLoading = true;
    if (this.signinForm.invalid) {
      this.loader.stop();
      this.isLoading = false;
      this.toastr.error('Please fill in your email and password correctly');
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
          next: () => {
            this.isLoading = false;
            this.router.navigate(['']);
          },
          error: () => {
            console.log(
              'you are logged in! but your profile as engineer/recruiter doesnt exist yet'
            );
            this.isLoading = false;
            this.router.navigate(['role']);
            this.loader.stop();
          },
        });
      },
      error: (err) => {
        this.showError = false;
        this.confirmEmailError = false;
        this.loader.stop();
        this.isLoading = false;

        if (err.status === 403) {
          this.confirmEmailError = true;
          this.toastr.error('Please verify your email before signing in. Check your inbox and spam folder for the verification link.');
        } else if (err.status === 401) {
          this.showError = true;
          this.toastr.error('Invalid email or password. Please try again.');
        } else if (err.status === 0) {
          this.toastr.error('Unable to connect to the server. Please check your internet connection and try again.');
        } else if (err.error && err.error.code) {
          // Handle specific error codes
          switch (err.error.code) {
            case 'authentication.validate_email':
              this.confirmEmailError = true;
              this.toastr.error('Your email address has not been verified. Please check your inbox for the verification link.');
              break;
            case 'login.verify_login':
              this.toastr.error('The email or password you entered is incorrect.');
              break;
            default:
              this.toastr.error('Sign in failed. Please try again later.');
          }
        } else {
          this.toastr.error('An unexpected error occurred. Please try again later.');
        }

        console.log(err);
      },
    });
  }

  // ngOnDestroy(): void {
  //   this.signinSub.unsubscribe();
  // }
}
