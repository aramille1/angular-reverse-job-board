import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common-service/common.service';
import { EngineerService } from 'src/app/services/engineer-service/engineer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  myProfileID: any;
  myProfileName: string;
  myProfileImg: string =
    'https://microbiology.ucr.edu/sites/default/files/styles/form_preview/public/blank-profile-pic.png';
  showMyEngineerProfile: Boolean = false;
  showMyBusinessProfile: Boolean = false;
  private isLoggedInSub: Subscription;
  private myProfileSub: Subscription;

  constructor(
    public auth: AuthService,
    public engineerService: EngineerService,
    private commonService: CommonService,
    private router: Router
  ) {
    this.isLoggedInSub = this.auth.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.myProfileSub = this.auth.getMyProfile().subscribe({
          next: (res) => {
            console.log(res);
            this.myProfileImg = res.user.Avatar || res.user.Logo;
            console.log(this.myProfileImg);

            this.myProfileID = res.user.ID;
            if (res.type === 'engineer') {
              this.showMyEngineerProfile = true;
              this.myProfileName = `${res.user.Firstname} ${res.user.Lastname}`
            }
            if (res.type === 'recruiter') {
              this.showMyBusinessProfile = true;
              this.myProfileName = `${res.user.Firstname} ${res.user.Lastname}`
            }
          },
          error: (error) => {
            console.log(error);
          },
        });
      }
    });
  }

  ngOnInit(): void {}

  getUserData() {
    this.myProfileSub = this.auth.getMyProfile().subscribe({
      next: (res) => {
        console.log(res);
        this.myProfileID = res.user.ID;
        if (res.type === 'engineer') {
          this.showMyEngineerProfile = true;
        }
        if (res.type === 'recruiter') {
          this.showMyBusinessProfile = true;
          this.myProfileName = `${res.user.Firstname} ${res.user.Lastname}`
        }
        console.log('showMyEngineerProfile', this.showMyEngineerProfile);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  ngOnDestroy(): void {
    this.isLoggedInSub.unsubscribe();
    this.myProfileSub.unsubscribe();
  }

  signout() {
    this.myProfileImg =
      'https://microbiology.ucr.edu/sites/default/files/styles/form_preview/public/blank-profile-pic.png';
    this.showMyBusinessProfile = false;
    this.showMyEngineerProfile = false;
    this.commonService.updateUserData({});
    this.myProfileID = null;
    this.auth.signout();
  }
}
