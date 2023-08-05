import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { updateObjectForHeader } from 'src/app/models/header-data';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common-service/common.service';
import { EngineerService } from 'src/app/services/engineer-service/engineer.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  myProfileID: any;
  myProfileName: string;
  myProfileImg: string = 'assets/empty-avatar.png';
  showMyEngineerProfile: Boolean = false;
  showMyBusinessProfile: Boolean = false;
  private isLoggedInSub: Subscription;
  private myProfileSub: Subscription;
  private updatedUserDataForHeaderSub: Subscription;

  constructor(
    public auth: AuthService,
    public engineerService: EngineerService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.updatedUserDataForHeaderSub =
      this.commonService.updatedUserDataForHeader$.subscribe({
        next: (data: updateObjectForHeader) => {
          this.myProfileImg = data.image;
          this.myProfileName = `${data.firstName} ${data.lastName}`;
        },
        error: (err) => {
          console.error(err);
        },
      });






    this.isLoggedInSub = this.auth.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.myProfileSub = this.auth.getMyProfile().subscribe({
          next: (res) => {
            this.myProfileImg = res.user.Avatar || res.user.Logo;
            this.myProfileID = res.user.ID;
            if (res.type === 'engineer') {
              this.showMyEngineerProfile = true;
              this.myProfileName = `${res.user.Firstname} ${res.user.Lastname}`;
            }
            if (res.type === 'recruiter') {
              this.showMyBusinessProfile = true;
              this.myProfileName = `${res.user.Firstname} ${res.user.Lastname}`;
            }
          },
          error: (error) => {
            console.error(error);
            if (error.error.code === 'authentication.validate_token') {
              this.auth.signout();
            }
          },
        });
      }
    });
  }

  ngOnInit(): void {
    this.auth.getMyProfile().subscribe({
      next: (res) => {
        console.log(res.user.Verified)
        if (res.user.Verified) {
          this.autoLogin()
        }
      },
      error: err => {
        console.log('couldnt get users data');

        console.log(err)
        console.error(err)
      }
    })
  }

  ngOnDestroy(): void {
    this.isLoggedInSub.unsubscribe();
    this.myProfileSub.unsubscribe();
    this.updatedUserDataForHeaderSub.unsubscribe();
  }

  signout() {
    this.myProfileImg =
      'https://microbiology.ucr.edu/sites/default/files/styles/form_preview/public/blank-profile-pic.png';
    this.showMyBusinessProfile = false;
    this.showMyEngineerProfile = false;
    this.myProfileID = null;
    this.auth.signout();
  }

  autoLogin() {
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
            this.auth.getMyProfile().subscribe({
              next: () => this.router.navigate(['']),
              error: () => {
                console.log(
                  'you are logged in! but your profile as engineer/recruiter doesnt exist yet'
                );
                this.router.navigate(['role']);
              },
            });
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
  }
}
