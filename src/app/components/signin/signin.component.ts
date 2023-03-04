import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common-service/common.service';
import { EngineerService } from 'src/app/services/engineer-service/engineer.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  showError:Boolean = false;
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService){}
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
        console.log(response)
        const parsedToken = JSON.parse(
          atob(response['auth_token'].split('.')[1])
        );
        localStorage.setItem('token', response['auth_token']);
        localStorage.setItem('expires', JSON.stringify(parsedToken.exp));
        this.auth.setIsLoggedIn(true);
        console.log("parsedToken", parsedToken); //parsedToken.userID
        this.commonService.sendUpdateUserId(parsedToken.userId)
        console.log('done!');
        // TODO
        // if I'm logged in AND created profile then:
        // this.engineerService.getMyProfile().subscribe((res) =>{
        //   if(res.engineer){
        //     this.router.navigate(['home'])
        //   }else{

        //   }
        // })
        this.router.navigate(['role']);
        // else:
      },
      error: (err) => {
        new Error(err)
        this.showError = true
      }

    })

  }

}
