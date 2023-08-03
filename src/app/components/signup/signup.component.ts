import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'src/app/matching-passwords.validator';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { CommonService } from 'src/app/services/common-service/common.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  fieldTextType: boolean;
  repeatFieldTextType: boolean;
  loader = this.loadingBar.useRef();

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

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType
  }

  toggleRepeatFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType
  }

  signup() {
    this.loader.start()
    if (this.signupForm.valid) {
      const signupData = {
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
      };
      this.commonService.updateEmailPasswordCredentials(signupData)
      this.auth.signup(signupData).subscribe({
        next: (response) => {
          this.toastr.success('Awesome, registration is successfull!');
          this.signupForm.reset();
          this.router.navigate(['/email-verify']);
          // this.router.navigate(['signin']);
          this.loader.stop()
        },
        error: (error) => {
          this.loader.stop()
          if (error.error.detail === 'user already created') {
            this.toastr.error('Account already exists');
          }
          throw error;
        },
      });
    }
  }
}
