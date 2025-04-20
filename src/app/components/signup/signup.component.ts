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
          this.toastr.success('Registration successful! Please check your email to verify your account.');
          this.router.navigate(['/signin']);
        },
        (error) => {
          // Stop the loading bar on error
          this.loader.stop();
          if (error.error.code === 'signup.email_registered') {
            this.toastr.error('This email is already registered.');
          } else {
            this.toastr.error(error.error.message || 'Registration failed. Please try again.');
          }
        }
      );
    } else {
      this.toastr.error('Please fill all required fields');
    }
  }

  checkPasswords(group: FormGroup): { [key: string]: boolean } | null {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { not_matching: true };
  }
}
