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
  private signinSub: Subscription;
  loader = this.loadingBar.useRef();
  // form initialization
  signinForm = this.fb.group({
    email: ['', Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')],
    password: ['', Validators.required],
  });
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private loadingBar: LoadingBarService,
    private toastr: ToastrService
  ) {}

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  ngOnInit(): void {
    this.loader.stop();
  }

  signin() {
    this.loader.start();
    if (this.signinForm.invalid) {
      this.loader.stop();
      this.toastr.error('please fill in your email and password');
      return;
    }
    const reqObject = {
      email: this.signinForm.value.email,
      password: this.signinForm.value.password,
    };
    this.signinSub = this.auth.signin(reqObject).subscribe({
      next: (response) => {
        const parsedToken = JSON.parse(
          atob(response['auth_token'].split('.')[1])
        );
        localStorage.setItem('token', response['auth_token']);
        localStorage.setItem('expires', JSON.stringify(parsedToken.exp));
        this.auth.setIsLoggedIn(true);
        console.log('loggedin!');
        this.auth.getMyProfile().subscribe({
          next: () => this.router.navigate(['']),
          error: () => {
            console.log(
              'you are logged in! but your profile as engineer/recruiter doesnt exist yet'
            );
            this.router.navigate(['role']);
            this.loader.stop();
          },
        });
      },
      error: (err) => {
        new Error(err);
        this.showError = true;
        this.loader.stop();
      },
    });
  }

  ngOnDestroy(): void {
    this.signinSub.unsubscribe();
  }
}
