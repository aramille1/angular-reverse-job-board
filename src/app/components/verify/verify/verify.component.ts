import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environments';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common-service/common.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  loading: boolean = true;
  showError: boolean = false;
  url = environment.apiUrl;
  userID: any
  verificationCode: any
  emailPasswordData: any;
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthService,
    private commonService: CommonService,
    private router: Router) {

  }
  ngOnInit(): void {
    this.userID = this.route.snapshot.paramMap.get('userID')
    this.verificationCode = this.route.snapshot.paramMap.get('verificationCode')
    console.log('----------------');
    console.log('userID')
    console.log(this.userID);
    console.log('----------------');


    console.log('verificationCode')
    console.log(this.verificationCode);
    console.log('----------------');

    // this.commonService.updateIsVerified(true)
    // this.commonService.isVerifiedStatus = true;

    this.http.get(`${this.url}/verify/${this.userID}/${this.verificationCode}`).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res)
        console.log('email succefully verified')

        this.commonService.emailPasswordCredentials$.subscribe({
          next: (emailpasswordData) => {
            console.log(emailpasswordData);
            console.log('redirected and loggedin already');


            this.auth.signin(emailpasswordData).subscribe({
              next: (response) => {
                const parsedToken = JSON.parse(
                  atob(response['auth_token'].split('.')[1])
                );
                localStorage.setItem('token', response['auth_token']);
                localStorage.setItem('expires', JSON.stringify(parsedToken.exp));
                this.auth.setIsLoggedIn(true);
                console.log('loggedin!');
                // this.auth.getMyProfile().subscribe({
                //   next: () => this.router.navigate(['']),
                //   error: () => {
                //     console.log(
                //       'you are logged in! but your profile as engineer/recruiter doesnt exist yet'
                //     );
                //     this.router.navigate(['role']);
                //   },
                // });
              },
              error: (err) => {
                new Error(err);
              },
            });

          },
          error: err => {
            console.error(err)
            console.log('wrong credentials')
          }
        })

      },
      error: err => {
        this.loading = false;
        this.showError = true;
        console.error(err)
        console.log('something went wrong with email verification');
      }
    })



  }
}
