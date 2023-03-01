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
  showMyProfile: Boolean = false;
  private subscriptionName: Subscription;

  constructor(
    public auth: AuthService,
    public engineerService: EngineerService,
    private commonService: CommonService
  ) {
    this.subscriptionName = this.commonService
      .getUpdate()
      .subscribe((engineerId) => {
        if (engineerId) {
          this.myProfileID = engineerId;
          this.showMyProfile = true;
        } else {
          this.showMyProfile = false;
        }
      });
  }

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe((isLoggedIn) => {
      console.log('isLoggedIn', isLoggedIn);
      if (isLoggedIn) {
        this.engineerService.getMyProfile().subscribe({
          next: (myProfile) => {
            console.log(myProfile);
            this.showMyProfile = true;
            this.myProfileID = myProfile.engineer.ID;
          },
          error: (error) => {
            this.showMyProfile = false;
            console.error(error);
            console.log('engineer is not found');
          },
        });
      } else {
        this.showMyProfile = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptionName.unsubscribe();
  }

  signout() {
    this.auth.signout();
  }
}
