import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BusinessService } from 'src/app/services/business-service/business.service';
import { CommonService } from 'src/app/services/common-service/common.service';
import { EngineerService } from 'src/app/services/engineer-service/engineer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  myProfileID: any;
  userId:string;
  showMyEngineerProfile: Boolean = false;
  showMyBusinessProfile: Boolean = false;
  private engineerSub: Subscription;
  private businessSub: Subscription;
  private userIdSub: Subscription;

  constructor(
    public auth: AuthService,
    public engineerService: EngineerService,
    private businessService: BusinessService,
    private commonService: CommonService
  ) {
    this.userIdSub = this.commonService.getUpdateUserId().subscribe(userId => this.userId = userId)
    this.engineerSub = this.commonService
      .getUpdateEngineer()
      .subscribe((engineerId) => {
        if (engineerId) {
          this.myProfileID = engineerId;
          this.showMyEngineerProfile = true;
          this.showMyBusinessProfile = false;
        } else {
          this.showMyEngineerProfile = false;
        }
      });
      // this.businessSub = this.commonService
      // .getUpdateBusiness()
      // .subscribe((recruiterId) =>{
      //   if(recruiterId){
      //     this.myProfileID = recruiterId
      //     this.showMyBusinessProfile = true;
      //   }else{
      //     this.showMyBusinessProfile = false;
      //   }
      // })
  }

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe((isLoggedIn) => {
      console.log('isLoggedIn', isLoggedIn);
      this.getEngineerProfile()
      this.getBusinessProfile()
    });
  }

  getEngineerProfile(){
    this.engineerService.getMyProfile().subscribe({
      next: (myProfile) => {
        if(myProfile.engineer.UserID === this.userId){
        // TODO
        // here for condition I need useId from user who loggedIn
        // in order to get user, Axel need to implement user/me endpoint
        this.showMyEngineerProfile = true;
        this.showMyBusinessProfile = false;
        this.myProfileID = myProfile.engineer.ID;
      }},
      error: (error) => {
        this.showMyEngineerProfile = false;
        console.error(error);
        console.log('engineer is not found, couldnt fetch engineer');
      },
    });
  }

  getBusinessProfile(){
    console.log('im in business fetch')
    this.businessService.getRecruiter('0dbea218-bae4-9ac7-5176-d1d5406f82fd').subscribe({
      // TODO here in stead of hardcoded recruiterID I need to get it from
      // GET /recruiter/me endpoint which I need to ask Axel to implement
      next: myProfile => {
        if(myProfile.recruiter.UserID === this.userId){
        // TODO
        // here for condition I need useId from user who loggedIn
        // in order to get user, Axel need to implement user/me endpoint
          this.showMyBusinessProfile = true;
          this.showMyEngineerProfile = false;
          this.myProfileID = myProfile.recruiter.ID
        }
      },
      error: (error) => {
        this.showMyBusinessProfile = false;
        console.error(error);
        console.log('recruiter is not found, couldnt fetch recruiter data');
      },
    })
  }
  ngOnDestroy(): void {
    this.engineerSub.unsubscribe();
    this.businessSub.unsubscribe();
    this.userIdSub.unsubscribe();
  }

  signout() {
    this.showMyBusinessProfile = false;
    this.showMyEngineerProfile = false;
    this.myProfileID = null
    this.auth.signout();
  }
}
