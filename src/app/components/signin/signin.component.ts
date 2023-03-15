import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  showError:Boolean = false;
  profile:any;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService){}

  signinForm = this.fb.group({
    email: ["",Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
    password: ["12345678", Validators.compose([Validators.required, Validators.minLength(8)])],
  })

  ngOnInit(): void {}

  signin(){
    if(this.signinForm.invalid){
      return;
    }
    this.auth.signin(this.signinForm).subscribe({
      next: (response) => {
        // console.log(response)
        const parsedToken = JSON.parse(
          atob(response['auth_token'].split('.')[1])
        );
        localStorage.setItem('token', response['auth_token']);
        localStorage.setItem('expires', JSON.stringify(parsedToken.exp));
        this.auth.setIsLoggedIn(true);
        // console.log("parsedToken", parsedToken); //parsedToken.userID
        // this.commonService.sendUpdateUserId(parsedToken.userId)
        console.log('loggedin!');

        this.auth.getMyProfile().subscribe({
          next:(res) => {
            console.log(res)
            this.commonService.updateUserData(res)
              this.router.navigate([''])
          },
          error: () =>{
            console.log("you are logged in! but your profile as engineer/recruiter doesnt exist yet")
            this.router.navigate(['role']);
          }
        })

      },
      error: (err) => {
        new Error(err)
        this.showError = true
      }

    })

  }

  whoisProfile(){
    console.log(this.profile)
  }

}
