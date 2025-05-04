import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'src/app/matching-passwords.validator';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { CommonService } from 'src/app/services/common-service/common.service';
import { environment } from 'environments/environments';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  fieldTextType: boolean;
  repeatFieldTextType: boolean;
  loader = this.loadingBar.useRef();
  signupForm: FormGroup;
  existingEmailError = false;
  emailSendingError = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private loadingBar: LoadingBarService,
    private commonService: CommonService
  ) {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      website: ['']  // Honeypot field
    }, { validator: this.checkPasswords });
  }

  ngOnInit(): void {
    // Remove reCAPTCHA initialization
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleRepeatFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }

  signup() {
    // Check for bot submissions using honeypot
    if (this.signupForm.value.website) {
      return;
    }

    // Reset error flags
    this.existingEmailError = false;
    this.emailSendingError = false;

    if (this.signupForm.valid) {
      // Start the loading bar
      this.loader.start();

      const signupData = {
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
      };

      this.authService.signup(signupData).subscribe(
        (response) => {
          // Stop the loading bar
          this.loader.complete();
          this.toastr.success('Registration successful! Please check your email and spam folder to verify your account.');
          this.router.navigate(['/signin']);
        },
        (error) => {
          // Stop the loading bar on error
          this.loader.stop();

          // Provide more specific error messages based on error codes
          if (error.error && error.error.code) {
            switch (error.error.code) {
              case 'signup.email_registered':
              case 'signup.validate_user':
                this.existingEmailError = true;
                this.toastr.error('This email address is already registered. Please try signing in instead or use a different email address.');
                break;
              case 'signup.validate_body':
                this.toastr.error('Please check your information. Your password must be between 8-20 characters.');
                break;
              case 'signup.send_confirmation_email':
                // Special handling for email sending failures
                this.emailSendingError = true;
                this.toastr.warning('Your account was created, but we could not send the verification email. Please contact support at support@angular-talents.com to verify your account.');

                // Still navigate to signin page as the account was created
                setTimeout(() => {
                  this.router.navigate(['/signin']);
                }, 5000); // Give user 5 seconds to read the message
                break;
              default:
                this.toastr.error('Registration failed. Please try again later or contact support if the problem persists.');
            }
          } else if (error.status === 0) {
            this.toastr.error('Unable to connect to the server. Please check your internet connection and try again.');
          } else {
            this.toastr.error('An unexpected error occurred. Please try again later.');
          }
        }
      );
    } else {
      // Form validation error messages
      if (this.signupForm.controls['email'].invalid && this.signupForm.controls['email'].touched) {
        this.toastr.error('Please enter a valid email address.');
      } else if (this.signupForm.controls['password'].invalid && this.signupForm.controls['password'].touched) {
        this.toastr.error('Password must be at least 8 characters long.');
      } else if (this.signupForm.controls['confirmPassword'].invalid && this.signupForm.controls['confirmPassword'].touched) {
        this.toastr.error('Passwords do not match.');
      } else {
        this.toastr.error('Please fill all required fields correctly.');
      }
    }
  }

  checkPasswords(group: FormGroup): { [key: string]: boolean } | null {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { not_matching: true };
  }
}
