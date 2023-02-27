import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  showError:Boolean = false;
  constructor(private auth: AuthService,private fb: FormBuilder,  private router: Router){}
  signinForm = this.fb.group({
    email: ["",Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
    password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
  })

  get f() { return this.signinForm.controls; }

  ngOnInit(): void {}

  signin(){
    if(this.signinForm.invalid){
      return;
    }
    this.auth.signin(this.signinForm).subscribe({
      next: (response) => {
        const parsedToken = JSON.parse(
          atob(response['auth_token'].split('.')[1])
        );
        this.auth.setIsLoggedIn(true);
        localStorage.setItem('token', response['auth_token']);
        localStorage.setItem('expires', JSON.stringify(parsedToken.exp));
        console.log('done!');
        // TODO
        // if I'm logged in AND created profile then:
        // this.router.navigate(['home'])
        // else:
        this.router.navigate(['role']);
      },
      error: (err) => {
        new Error(err)
        this.showError = true
      }

    })

  }

}
