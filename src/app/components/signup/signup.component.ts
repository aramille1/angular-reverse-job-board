import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  recaptchaSiteKey: string;
  isRecaptchaValid: boolean = false;

  // form initialization
  signupForm = this.fb.group({
    email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')],
    password: [
      '',
      Validators.compose([Validators.required, Validators.minLength(8)]),
    ],
    confirmPassword: [
      '',
      [
        Validators.required,
      ],
    ],
    website: [''], // honeypot field - should remain empty
    recaptchaResponse: ['', Validators.required]
  },
    { validator: CustomValidators.MatchingPasswords });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private loadingBar: LoadingBarService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.recaptchaSiteKey = "6LdJ-BkrAAAAAE1f-Y-fC8vuM4RhsOz2q78DJ2se";
    console.log(this.recaptchaSiteKey);
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleRepeatFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }

  onRecaptchaResolved(response: string) {
    this.isRecaptchaValid = !!response;
    this.signupForm.patchValue({
      recaptchaResponse: response
    });
  }

  signup() {
    this.loader.start();
    // Validate honeypot - if field is filled, it's probably a bot
    if (this.signupForm.value.website) {
      this.toastr.error('An error occurred');
      this.loader.stop();
      return;
    }

    if (this.signupForm.valid && this.isRecaptchaValid) {
      const signupData = {
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        recaptchaResponse: this.signupForm.value.recaptchaResponse,
        website: '' // Send empty honeypot field to backend for verification
      };

      this.auth.signup(signupData).subscribe({
        next: () => {
          this.toastr.success('Awesome, registration is successfull!');
          this.signupForm.reset();
          this.router.navigate(['/email-verify']);
          this.loader.stop();
        },
        error: (error) => {
          this.loader.stop();
          if (error.error.detail === 'user already created') {
            this.toastr.error('Account already exists');
          } else if (error.error.code === 'signup.validate_recaptcha') {
            this.toastr.error('reCAPTCHA validation failed. Please try again.');
          } else {
            this.toastr.error('Registration failed. Please try again.');
          }
          throw error;
        },
      });
    } else {
      this.loader.stop();
      this.toastr.error('Please fill all required fields and complete the reCAPTCHA');
    }
  }
}
