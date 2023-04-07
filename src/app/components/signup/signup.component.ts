import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  // form initialization
  signupForm = this.fb.group({
    email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')],
    password: [
      '',
      Validators.compose([Validators.required, Validators.minLength(8)]),
    ],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  signup() {
    if (this.signupForm.valid) {
      console.log(this.signupForm.value);
      const signupData = {
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
      };
      this.auth.signup(signupData).subscribe({
        next: (response) => {
          this.toastr.success('Awesome, you are registered successfully!');
          this.signupForm.reset();
          this.router.navigate(['signin']);
          console.log(response);
        },
        error: (error) => {
          throw error;
        },
      });
    }
  }
}
