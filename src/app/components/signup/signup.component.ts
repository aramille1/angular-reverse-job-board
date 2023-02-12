import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit{
  signupForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  })
  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private router: Router){}

  ngOnInit(): void {
    // TO-DO change signupForm the same as in signin
  }

  signup(){
    if(this.signupForm.valid){
      this.auth.signup(this.signupForm)
    }
  }
}
