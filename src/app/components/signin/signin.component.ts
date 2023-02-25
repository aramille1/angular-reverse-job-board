import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  loggedIn$:Observable<boolean>

  constructor(private auth: AuthService,private fb: FormBuilder){}
  signinForm = this.fb.group({
    email: ["",Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
    password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
  })

  get f() { return this.signinForm.controls; }

  ngOnInit(): void {
    //TODO add some ui when user put wrong email and password
    this.loggedIn$ = this.auth.isLoggedIn$
  }

  signin(){
    if(this.signinForm.invalid){
      return;
    }
    console.log(this.signinForm.get('password'))
    this.auth.signin(this.signinForm)

  }

}
