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
  hcaptchaSiteKey: string;
  isCaptchaValid: boolean = false;

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
    this.hcaptchaSiteKey = environment.hcaptcha.siteKey;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleRepeatFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }

  onCaptchaVerify(token: string) {
    this.isCaptchaValid = !!token;
    this.signupForm.patchValue({
      recaptchaResponse: token
    });
  }

  onCaptchaError() {
    this.isCaptchaValid = false;
    this.toastr.error('CAPTCHA verification failed. Please try again.');
  }

  onCaptchaExpired() {
    this.isCaptchaValid = false;
    this.toastr.warning('CAPTCHA expired. Please verify again.');
  }

  signup() {
    this.loader.start();
    // Validate honeypot - if field is filled, it's probably a bot
    if (this.signupForm.value.website) {
      this.toastr.error('An error occurred');
      this.loader.stop();
      return;
    }

    if (this.signupForm.valid && this.isCaptchaValid) {
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
          } else if (error.error.code === 'signup.validate_captcha') {
            this.toastr.error('CAPTCHA validation failed. Please try again.');
          } else if (error.error.detail && error.error.detail.includes('unknown key')) {
            this.toastr.error('Server validation error. Please contact support.');
            console.error('API field mismatch:', error.error.detail);
          } else {
            this.toastr.error('Registration failed. Please try again.');
          }
          console.error(error);
        },
      });
    } else {
      this.loader.stop();
      this.toastr.error('Please fill all required fields and complete the CAPTCHA');
    }
  }
}
