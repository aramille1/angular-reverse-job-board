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
  showMyEngineerProfile: Boolean = false;
  showMyBusinessProfile: Boolean = false;
  private userDataSub: Subscription;
  private isLoggedInSub: Subscription;
  private myProfileSub: Subscription;

  constructor(
    public auth: AuthService,
    public engineerService: EngineerService,
    private commonService: CommonService,
    private router: Router
  ) {
      this.userDataSub = this.commonService.getUserData().subscribe({
        next: res => {
          if(res.user){
          this.myProfileID = res.user.ID
            if(res.type === 'engineer'){
              this.showMyEngineerProfile = true;
            }
            if(res.type === 'recruiter'){
              this.showMyBusinessProfile = true;
            }
          }
        },
        error: error => {
          throw error
        }
      })
  }

  ngOnInit(): void {
    this.isLoggedInSub = this.auth.isLoggedIn$.subscribe((isLoggedIn) => {
      console.log('isLoggedIn', isLoggedIn);
      if(isLoggedIn){
        this.getUserData();
      }

    });
  }


  getUserData(){
    this.myProfileSub = this.auth.getMyProfile().subscribe({
      next: res => {
        console.log(res)
        this.myProfileID = res.user.ID
          if(res.type === 'engineer'){
            this.showMyEngineerProfile = true;
          }
          if(res.type === 'recruiter'){
            this.showMyBusinessProfile = true;
          }
          console.log('showMyEngineerProfile', this.showMyEngineerProfile);

      },
      error: error => {
        console.log(error)
      }
    })
  }

  ngOnDestroy(): void {
    this.userDataSub.unsubscribe();
    this.isLoggedInSub.unsubscribe();
    this.myProfileSub.unsubscribe();
  }

  signout() {
    this.showMyBusinessProfile = false;
    this.showMyEngineerProfile = false;
    this.commonService.updateUserData({})
    this.myProfileID = null
    this.auth.setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
    this.router.navigate(['signin']);
  }
}
